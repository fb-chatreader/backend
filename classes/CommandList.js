const Message = require('./Message.js');
const reqDir = require('require-dir');

module.exports = class CommandList {
  constructor() {
    this.commands = reqDir('../routes/messages/commands/');
  }

  execute(input) {
    const defaultCommand = 'get_started';
    const responseObject = this.commands[input.command]
      ? this.commands[input.command](input)
      : this.commands[defaultCommand](input);

    const message = new Message(responseObject, input);

    if (message.responses) {
      message.send();
    }
    return true;
  }
};
