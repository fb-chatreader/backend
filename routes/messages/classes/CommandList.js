const Command = require('../classes/Command.js');
const reqDir = require('require-dir');

module.exports = class CommandList {
  constructor() {
    this.commands = reqDir('../commands/');
  }

  execute(event) {
    // If the command exists, execute it
    if (this.commands[event.command]) {
      const executed = new Command(this.commands[event.command](event), event);
      executed.sendResponses();
      return true;
    }
    // Could write an 'else' statement here that runs a 'help' command
    // for any unrecognized commands
  }
};
