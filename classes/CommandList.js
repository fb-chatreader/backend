const Message = require('./Message.js');
const reqDir = require('require-dir');

class CommandList {
  constructor() {
    this.commands = reqDir('../routes/messages/commands/');
  }

  run(event) {
    const message = new Message(event);
    message.response = this._getResponseObject(message);

    message.respond();
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
}

module.exports = new CommandList();
