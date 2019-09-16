const Message = require('./Message.js');
const reqDir = require('require-dir');

module.exports = class CommandList {
  constructor() {
    this.commands = reqDir('../routes/messages/commands/');
  }

  execute(event) {
    const message = new Message(event);
    message.response = this._getResponseObject(message);

    message.respond();
  }

  _getResponseObject(message) {
    if (this._isValidCommand(message.event.command)) {
      // User submitted valid command or postback
      return this.commands[message.event.command](message.event);
    } else if (this._processMessage(message)) {
      // User submitted data, like an email address
      message.event.command = this._processMessage(message);
      return this.commands[message.event.command](message.event);
    } else {
      // User sent message or postback the bot doesn't recognize
      const defaultCommand = 'get_started';
      return this.commands[defaultCommand](message.event);
    }
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
};
