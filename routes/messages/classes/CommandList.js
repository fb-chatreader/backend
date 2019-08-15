const reqDir = require('require-dir');

module.exports = class CommandList {
  constructor() {
    this.commands = reqDir('../commands/');
    this.postbacks = reqDir('../postbacks/');
  }

  execute(event) {
    const type = event.postback
      ? 'postbacks'
      : event.message
      ? 'commands'
      : null;

    if (!type) {
      return;
    }

    const parsedInput =
      type === 'commands'
        ? event.message.text
            .toLowerCase()
            .split(' ')
            .join('_')
        : event.postback.payload.toLowerCase();

    // Execute either the command or postback
    if (this[type][parsedInput]) {
      this[type][parsedInput](event);
      return true;
    }
    // Could write an 'else' statement here that runs a 'help' command
    // for any unrecognized commands
  }
};
