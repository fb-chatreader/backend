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
      if (executed.responses) {
        executed.sendResponses();
      }
      return true;
    } else {
      // Otherwise default to get_started
      const executed = new Command(this.comamnds.get_started(event), event);
      executed.sendResponses();
      return true;
    }
  }
};
