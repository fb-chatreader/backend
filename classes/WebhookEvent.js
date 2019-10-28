const Users = require('models/db/users.js');
const Books = require('models/db/books.js');
const addTimedMessage = require('routes/messages/helpers/addTimedMessage.js');

module.exports = class WebhookEvent {
  constructor() {
    this.command;
    this.sender;
    this.event;

    this.user;
    this.user_id;

    this.page;
    this.page_id;
    this.access_token;

    // Trigger timed message check for each message
  }

  processHook(entry) {
    // Tries to identify the type of webhook and save the relevant data
    if (this._isPolicyViolation(entry)) {
      return this._parsePolicyViolation(entry);
    } else if (this._isValidUserAction(entry)) {
      return this._parseUserAction(entry[0].messaging[0]).then(x => x);
    } else {
      return false;
    }
  }

  setUser(u) {
    const { id, ...user } = u;
    this.user = user;
    this.user_id = id;
    addTimedMessage(id, this.page_id);
  }

  setEventData(e) {
    const { command, type, sender, bookCount, ...specifics } = e;
    this.command = command;
    this.type = type;

    for (let key in specifics) {
      // Any data passed through a referral or postback is added to the Event (ie: book_id)
      this[key] = specifics[key];
    }

    if (sender) {
      // Policy violations do not have these properties
      this.sender = sender.id;
      this.bookCount = bookCount;
    }
  }

  setPage(page) {
    Promise.resolve(page).then(p => {
      const { id, access_token, ...page } = p;
      this.page_id = id;
      this.access_token = access_token;
      this.page = page;
    });
  }

  isSingleBookPage() {
    return this.bookCount === 1;
  }

  isMultiBookPage() {
    return this.bookCount > 1;
  }

  _isPolicyViolation(entry) {
    return entry[0] && entry[0]['policy-enforcement'];
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
    return entry && entry[0] && entry[0].messaging;
  }

  async _parseUserAction(message) {
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
    const books = await Books.retrieve({ 'b.page_id': entry[0].page.id });

    // Default data based to every command
    const parsed_data = {
      sender: message.sender,
      page: entry[0].page,
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
        ...handleReferral(entry[0].messaging[0].referral.ref),
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
    return parsed_data;
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
