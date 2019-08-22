const Command = require('../classes/Command.js');
const reqDir = require('require-dir');

module.exports = class CommandList {
  constructor() {
    this.commands = reqDir('../commands/');
    // this.commands.get_started ? this.commands.get_started() : '';
    // console.log(this.commands)
  }

  executePersistentMenu(event) {
    const executed = new Command(
      this.commands[this.command.persistent_menu](event),
      event
    );
    executed.sendResponses();
  }

  execute(event) {
    // If the command exists, execute it
    // if (this.commands.get_started) {
    //   const executed = new Command(this.commands['get_started'](event), event);
    //   executed.sendResponses();
    // }
     if (this.commands[event.command]) {
      const executed = new Command(this.commands[event.command](event), event);
      if (executed.responses) {
        executed.sendResponses();
      }

      console.log('not sending')
      return true;
    }
    // Could write an 'else' statement here that runs a 'help' command
    // for any unrecognized commands
  }
};
