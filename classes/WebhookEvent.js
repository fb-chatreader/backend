const Users = require('models/db/users.js');
const Books = require('models/db/books.js');
const addTimedMessage = require('routes/messages/helpers/addTimedMessage.js');

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

    // sender is the PSID of whoever triggered the webhook
    this.sender_id;

    // The 'user' and 'page' objects are broken down into smaller parts for ease of
    // destructuring, as things like user_id are used in almost every command
    this.user;
    this.user_id;

    const { id: page_id, access_token, ...page } = pageInfo;
    this.page = page;
    this.page_id = page_id;
    this.access_token = access_token;

    // The response the bot will send to this webhook event
    this.response;

    // Change value if your command doesn't respond to the user
    this.willRespond = true;

    this.queue = new Queue(this);
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

  async isNotUserMessage() {
    return this.type !== 'command';
  }

  async isUserMessage() {
    return this.type === 'command';
  }

  async isOnboarded() {
    const { user_id } = this;

    const userCategories = await UserCategories.retrieve({ user_id });

    if (userCategories.length < 3) {
      return Event.setOverride('pick_category');
    } else if (!event.user.email) {
      return Event.setOverride('request_email');
    } else if (event.user.prefersLongSummaries === null) {
      return Event.setOverride('request_summary_preference');
    }

    // User has completed onboarding
    if (Event.hasOwnProperty('prefersLongSummaries')) {
      // Event.prefersLongSummaries will exist on the postback
      // from request_summary_preference (in English: the user sent the final
      // piece needed to complete onboarding and should progress)
      const { prefersLongSummaries } = event;
      const updatedUser = await Users.edit(
        { id: user_id },
        { prefersLongSummaries }
      );
      Event.user = updatedUser;
    }
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
    this.override = command;
  }

  setPage(page) {
    Promise.resolve(page).then(p => {
      const { id, access_token, ...page } = p;
      this.page_id = id;
      this.access_token = access_token;
      this.page = page;
    });
  }

  setResponse(response) {
    this.response = response;
  }

  setUser(u) {
    const { id, facebook_id, ...user } = u;
    this.user = user;
    this.user_id = id;
    addTimedMessage(id, this.page_id);
  }

  validateCommand(command) {
    this.validatedCommand = command;
  }

  _isPolicyViolation(entry) {
    return entry['policy-enforcement'];
  }

  _parsePolicyViolation(entry) {
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
    }

    this.setUser(user);

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
            ...parsed_data,
            ...handleReferral(message.postback.referral.ref),
            type: 'referral'
          })
        : this.setEventData({
            ...parsed_data,
            ...JSON.parse(payload),
            type: 'postback'
          });
    } else if (message.referral) {
      // This block will fire under one condition:
      // 1) User clicked a referral link and has used the bot before

      // Sample referral link:
      // http://m.me/109461977131004?ref=command=start_book,book_id=1

      this.setEventData({
        ...parsed_data,
        ...handleReferral(message.referral.ref),
        type: 'referral'
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
    delete refData.command;

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
