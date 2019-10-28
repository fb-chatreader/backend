const EventClass = require('./WebhookEvent.js');
const reqDir = require('require-dir');

class Dispatch {
  constructor() {
    this.commands = reqDir('../routes/messages/commands/');
    this.templates = reqDir('routes/messages/UI/');
    this.conditions = reqDir('routes/messages/conditions/');
    this.db = reqDir('models/db/');
    this.helpers = reqDir('routes/messages/helpers');
  }

  run(event) {
    const Event = new EventClass(event);
    Event.response = this._getResponseObject(Event);

    message.respond();
  }

  async setConditions(...args) {
    for (let i = 0; i < args.length; i++) {
      const c = args[i];
      if (!this.conditions[c]) {
        console.error(`Warning: condition ${c} was not found.`);
        continue;
      }

      const condition = this.conditions[c];

      const passes = await condition.evaluate.call(this);
      if (!passes) {
        return await condition.action.call(this);
      }
    }
  }

  withDBs(...args) {
    const dbs = [];

    args.forEach(name => {
      dbs.push(this.db[name]);
    });

    return dbs;
  }

  _getResponseObject(message) {
    let command;
    if (this._isValidCommand(message.event.command)) {
      // User submitted valid command or postback
      command = message.event.command;
    } else if (this._processMessage(message)) {
      // User submitted data, like an email address
      command = this._processMessage(message);
    } else {
      // User sent something the bot doesn't recognize
      command = 'get_started';
    }
    return this.commands[command].call(message);
  }

  _isValidCommand(command) {
    return this.commands[command];
  }

  _processMessage(message) {
    if (!message.event) {
      console.log('No message sent.  "Event" not found: ', message);
      return;
    }
    if (this._containsValidEmail(message.event.original_message)) {
      // User sent a message that is a valid email
      return 'save_email';
    }
    return null;
  }

  _containsValidEmail(email) {
    // Test for email format.  Tests in order:
    // one @, dot after @
    // first character is a number or letter
    // last character is a letter
    return (
      email &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      /[a-zA-Z0-9]/.test(email[0]) &&
      /[a-zA-Z0-9]/.test(email[email.length - 1])
    );
  }

  async respond() {
    if (!this.response) return;
    // If the response isn't a promise, make it one.
    // Now we can always assume it's a promise.
    this.response = Promise.resolve(this.response);

    const resolved = await this._resolvePromises();
    if (!resolved) {
      console.error(
        `No response sent to user.  ${this.command} returned: ${resolved}`
      );
      return;
    }
    this._messageQueue(resolved);
  }

  _resolvePromises(promise = this.response) {
    if (promise.then) {
      return promise.then(res => res);
    } else if (promise[0] && promise[0].then) {
      return Promise.all(this.response).then(res => res);
    } else return promise;
  }

  async _messageQueue(resolved) {
    await resolved;
    if (Array.isArray(resolved[0])) {
      resolved = [...resolved[0], resolved.slice(1)];
    }
    if (!Array.isArray(resolved)) {
      console.error(
        `No message sent.  An array must be returned from ${this.event.command}`
      );
      return;
    }
    const message = resolved.shift();

    await this._sendToMessengerAPI(message);

    if (resolved.length) {
      this._messageQueue(resolved);
    } else console.log('Message Sent');
  }

  async _sendToMessengerAPI(message) {
    // Send a single message object to the Facebook API
    if (message && !Array.isArray(message)) {
      const msgObj = {
        recipient: {
          id: this.sender
        },
        message
      };
      const url = `https://graph.facebook.com/v2.6/me/messages?access_token=${this.access_token}`;
      await axios.post(url, msgObj).catch(err => {
        err.response
          ? console.error('Error sending Response: ', err.response.data)
          : console.error('Error sending Response: ', err);
      });
    } else {
      Array.isArray(message)
        ? console.error(
            `Error: received an array for a message from ${this.event.command}: `,
            message
          )
        : console.error('Error: No message to send!');
    }
  }
}

module.exports = new Dispatch();
