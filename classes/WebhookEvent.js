const axios = require('axios');

const Users = require('models/db/users.js');
const Books = require('models/db/books.js');
const Categories = require('models/db/categories.js');
const UserCategories = require('models/db/userCategories.js');
const TimedMessages = require('models/db/timedMessages.js');
const UserTracking = require('models/db/userTracking.js');

const Queue = require('./MessageQueue.js');

/*
  Whenever a webhook you are subscribed to is fired, WebhookEvents will parse the data
  into a consistent format used by the bot, greatly simplifying the commands.
*/
module.exports = class WebhookEvent {
  constructor(pageInfo) {
    // The 'command' is kind of a misnomer, as 'input' might be more accurate.
    // However, for ease of postback payloads, we've left it as command.
    // The 'command' value should never be overridden, as it's critical for knowing
    // what the user intended to do.
    this.command;

    // validatedCommand is set once the Dispatcher identifies the command the user wants to run.
    // Generally not overridden but doesn't break anything in the app.
    this.validatedCommand;

    // The override command can be overridden whenever needed.  It is set when
    // a condition for a command is not met and something must be ran first
    this.override;
    this.isOverridden = false;

    // sender is the PSID of whoever triggered the webhook
    this.sender_id;

    // The 'user' and 'page' objects are broken down into smaller parts for ease of
    // destructuring, as things like user_id are used in almost every command
    this.user;
    this.user_id;

    // If it's the first time a user is talking to the bot, this value will be true
    this.isNewUser;

    const { id: page_id, access_token, ...page } = pageInfo;
    this.page = page;
    this.page_id = page_id;
    this.access_token = access_token;

    // The response the bot will send to this webhook event
    this.response;

    // Change value if your command doesn't respond to the user
    this.willRespond = true;

    // The messages sent to the user are stored in a queue.  They are an instance of the webhook event instead of
    // existing globally on Dispatch for ease of debugging.
    this.queue = new Queue(this);
  }

  async getUserInfo() {
    const { sender_id, access_token } = this;
    const url = `https://graph.facebook.com/${sender_id}?fields=first_name&access_token=${access_token}`;
    try {
      const request = await axios.get(url);
      return request.data;
    } catch (err) {
      if (process.env.DB_ENVIRONMENT !== 'testing') {
        console.error(
          'Error querying user info: ',
          err.response ? err.response.data : err
        );
      }
    }
  }

  doNotRespond() {
    this.willRespond = false;
  }

  isNewPage() {
    return !this.bookCount;
  }

  isSingleBookPage() {
    return this.bookCount === 1;
  }

  isMultiBookPage() {
    return this.bookCount > 1;
  }

  isPostback() {
    return this.type === 'postback';
  }

  overrideOnUserMessage(command = 'get_started') {
    if (this.type === 'message') {
      return this.setOverride(command);
    }
  }

  overrideOnMissingProperty(prop, command = 'get_started') {
    if (!this[prop]) {
      return this.setOverride(command);
    }
  }

  async overrideIfNotOnboarded() {
    if (!this.isOverridden) {
      const { user_id } = this;
      const userCategories = await UserCategories.retrieve({ user_id });
      if (userCategories.length < 3) {
        return this.setOverride('request_categories');
      } else if (!this.user.email) {
        return this.setOverride('request_email');
      } else if (this.user.prefersLongSummaries === null) {
        return this.setOverride('request_summary_preference');
      }
    }
  }

  async isUserOnboarded() {
    const { user_id } = this;
    const userCategories = await UserCategories.retrieve({ user_id });
    if (userCategories.length < 3) {
      return false;
    } else if (!this.user.email) {
      return false;
    } else if (this.user.prefersLongSummaries === null) {
      return false;
    }
    return true;
  }

  async processHook(entry) {
    // Tries to identify the type of webhook and save the relevant data
    if (this._isPolicyViolation(entry)) {
      return this._parsePolicyViolation(entry);
    } else if (this._isValidUserAction(entry)) {
      return await this._parseUserAction(entry);
    } else {
      return false;
    }
  }

  setEventData(e) {
    const { command, type, sender_id, bookCount, ...specifics } = e;
    this.command = command;
    this.type = type;

    for (let key in specifics) {
      // Any data passed through a referral or postback is added to the Event (ie: book_id)
      this[key] = specifics[key];
    }

    if (sender_id) {
      // Policy violations do not have these properties
      this.sender_id = sender_id;
      this.bookCount = bookCount;
    }
  }

  setOverride(command) {
    // The first override should receive priority
    if (!this.isOverridden && !this.override) {
      this.type = 'redirect';
      this.isOverridden = true;
      this.override = command;
      return this.override;
    }
  }

  hasOverride() {
    return this.isOverridden;
  }

  setPage(page) {
    Promise.resolve(page).then(p => {
      const { id, access_token, ...page } = p;
      this.page_id = id;
      this.access_token = access_token;
      this.page = page;
    });
  }

  async updateUserTracking(current_summary_id) {
    const { user_id, book_id } = this;
    if (!user_id || !book_id || !current_summary_id) {
      throw new Error(
        'Cannot update user tracking without: user_id, book_id, & current_summary_id'
      );
    }
    const progressOnBook = await UserTracking.retrieve({
      user_id,
      book_id
    }).first();

    !progressOnBook
      ? await UserTracking.add({
          user_id,
          book_id,
          last_summary_id: current_summary_id
        })
      : await UserTracking.edit(
          { user_id, book_id },
          {
            last_summary_id: current_summary_id,
            repeat_count: progressOnBook.repeat_count + 1
          }
        );
  }

  setResponse(response) {
    this.response = response;
  }

  setUser(u, addTimeUser) {
    const { id, ...user } = u;
    this.user = user;
    this.user_id = id;
    if (addTimeUser) {
      this.addTimedMessage();
    }
  }

  setValidatedCommand(command) {
    this.validatedCommand = command;
  }

  canUserStartBook() {
    const { user } = this;
    if (!user) {
      throw new Error(
        'Cannot check if user can start a book before there is a user.'
      );
    }

    const { stripe_subscription_status, credits } = user;

    let canRead = stripe_subscription_status === 'active';

    // Only use tokens if the user is NOT subscribed
    if (!canRead && credits) {
      canRead = true;
      // If the account is not subscribed, decrement credits
      Users.edit({ id: this.user_id }, { credits: user.credits - 1 }).then(
        x => x
      );
    }
    return canRead;
  }

  async getNewCategoriesForUser() {
    const { user_id, page_id } = this;
    if (!user_id || !page_id) {
      throw new Error(
        'Cannot get categories for user before there is a user and page id'
      );
    }
    const allCategories = await Categories.retrieve({ page_id });
    const userCategories = await UserCategories.retrieve({ user_id });
    const userCategoryIDs = userCategories.map(c => c.category_id);

    return allCategories.filter(c => userCategoryIDs.indexOf(c.id) === -1);
  }

  insertPreviousState(state) {
    for (let property in state) {
      this[property] = state[property];
    }
  }

  async addTimedMessage() {
    const { user_id, page_id } = this;
    if (!user_id || !page_id) {
      throw new Error(
        'Cannot create a timed message without user and page IDs'
      );
    }

    // To better catch a user at the start of their free time,
    // only update timed messages if one doesn't already exists
    const timedMessage = await TimedMessages.retrieve({
      user_id,
      page_id
    }).first();

    if (!timedMessage) {
      await TimedMessages.add({
        user_id,
        page_id
      });
    }
  }

  _isPolicyViolation(entry) {
    return entry['policy-enforcement'];
  }

  _parsePolicyViolation(entry) {
    console.log('Received new policy violation');
    // If the bot does something Facebook doesn't like, they'll trigger a policy_violation
    // webhook.  All we do is save it to the database so we can occasionally (manually) check
    // if something has gone wrong
    this.setEventData({
      command: 'policy_violation',
      type: 'policy_violation',
      ...entry[0]['policy-enforcement'],
      page_id: entry[0].id
    });
    return true;
  }

  _isValidUserAction(entry) {
    return entry.messaging;
  }

  async _parseUserAction(entry) {
    const { Event } = entry;
    const message = entry.messaging[0];

    // If the user does something to trigger a webhook (referral link, postback, send a message, etc)
    // this finds the relevant data and stores it

    // Get user if they exists already in our database
    let user = await Users.retrieve({ facebook_id: message.sender.id }).first();

    if (!user) {
      // Save sender ID in DB if they're a new user
      user = await Users.add({ facebook_id: message.sender.id });
      Event.isNewUser = true;
    }

    this.setUser(user, true);

    // So many commands currently rely on how many books are available
    // for the page, we've added the bookCount as a default
    const books = await Books.retrieve({ 'b.page_id': Event.page_id });

    // Default data based to every command
    const parsed_data = {
      sender_id: message.sender.id,
      bookCount: books.length
    };

    if (message.postback || (message.message && message.message.quick_reply)) {
      // There are 3 conditions that can fire this block:
      // 1) User clicked a postback button
      // 2) User clicked a quick reply button
      // 3) User followed a referral link and has never used the bot before

      // Postbacks and quick replies are handled in exactly the same way, the payload
      // is just in a different location in the object.
      const payload = message.postback
        ? message.postback.payload
        : message.message.quick_reply.payload;

      const isReferral = message.postback && message.postback.referral;

      isReferral
        ? this.setEventData({
            type: 'referral',
            ...parsed_data,
            ...this._handleReferral(message.postback.referral.ref)
          })
        : this.setEventData({
            type: 'postback',
            ...parsed_data,
            ...JSON.parse(payload)
          });
    } else if (message.referral) {
      // This block will fire under one condition:
      // 1) User clicked a referral link and has used the bot before

      // Sample referral link:
      // http://m.me/109461977131004?ref=command=start_book,book_id=1

      this.setEventData({
        type: 'referral',
        ...parsed_data,
        ...this._handleReferral(message.referral.ref)
      });
    } else if (message && message.message) {
      // Fires whenever the user types something at the bot
      this.setEventData({
        ...parsed_data,
        command: message.message.text
          .toLowerCase()
          .split(' ')
          .join('_'),
        type: 'message'
      });
    }
    return true;
  }

  _handleReferral(qs) {
    const refData = this._queryStringToObject(qs);

    refData.command = refData.command ? refData.command : 'start_book';

    return refData;
  }

  _queryStringToObject(query) {
    const obj = {};
    const vars = query.split(',');
    vars.forEach(v => {
      const pair = v.split('=');
      obj[pair[0]] = pair[1];
    });
    return obj;
  }
};
