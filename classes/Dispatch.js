const reqDir = require('require-dir');

class Dispatch {
  /*
    Dispatcher holds all the current commands as well as what they need in order to run.
    If you execute a command, it will verify that command passes all conditions before
    sending.  In the event a condition fails, it will instead dispatch a command to fix
    the issue.
  */
  constructor() {
    this.commands = reqDir('../routes/messages/commands/');
    this.conditions = reqDir('../routes/messages/conditions/');

    this.templates = reqDir('../routes/messages/Templates/');
    this.db = reqDir('../models/db/');
    this.helpers = reqDir('../routes/messages/helpers');
  }

  async execute(Event, override) {
    if (!override) {
      // You should generally NOT provide an override to execute.  Only useful if you want to
      // control the command being ran.  If so, place your own validatedCommand on the Event
      // and set the override parameter to true
      Event.validatedCommand = this._findCommand(Event.command);
    }

    if (this.conditions[Event.validatedCommand]) {
      // Run conditions to find out if an override command should be set,
      // if conditions exist for the command
      await this.conditions[Event.validatedCommand].call(this, Event);
    }

    Event.setResponse(await this._getResponse(Event));

    if (Event.willRespond && Event.response) {
      // If you don't want a command to respond, you can always run
      // Event.doNotRespond()
      this.respond(Event);
    }
  }

  import(key, ...args) {
    // Alternate way of importing
    // Call this method with what type of import you want (check approvedKeys below)
    // then a string of arguments (separated by commas) of the files you want
    // And it'll return them in an array in the same order to be easily destructured

    // Argument strings must match file name.  Rename to whatever you like when destructuring
    const imported = [];
    const approvedKeys = {
      templates: true,
      db: true,
      helpers: true
    };

    if (!approvedKeys[key]) {
      throw new Error(
        `Cannot import ${key}.  Approved imports are: ${Object.keys(
          approvedKeys
        )}`
      );
    }

    args.forEach(name => {
      const item = this[key][name];
      if (item) {
        imported.push(item);
      } else {
        throw new Error(`Error importing ${key} '${name}': not found`);
      }
    });

    return imported;
  }

  withDBs(...args) {
    return this.import('db', ...args);
  }

  withTemplates(...args) {
    return this.import('templates', ...args);
  }

  withHelpers(...args) {
    return this.import('helpers', ...args);
  }

  async sendTemplate(name, ...args) {
    // If you want to immediately run a template instead of importing it then running it,
    // run this with any arguments the template wants, everything separated by a comma.
    const template = this.templates[name];
    if (template) {
      return await template(...args);
    } else {
      throw new Error(`Error importing template '${name}': not found`);
    }
  }

  redirectTo(Event, command) {
    Event.validatedCommand = command;
    this.execute(Event, true);
  }

  getReturnFrom(Event, command) {
    return this.commands[command].call(this, {
      ...Event,
      validatedCommand: command
    });
  }

  async respond(Event) {
    // If the response isn't a promise, make it one.
    // Now we can always assume it's a promise.
    const resolved = await Promise.resolve(Event.response);
    // console.log('RESOLVED: ', resolved);

    if (!resolved) {
      console.error(
        `No response sent to user.  ${Event.command} returned: ${resolved}`
      );
      return;
    }

    this._queueMessages(resolved).then(m => {
      Event.queue.add(...m);
      Event.queue.send();
    });
  }

  _findCommand(command) {
    // This method is necessary since sometimes what the user types isn't a command
    // For example, if they type an email, the bot has to figure out to run save_email with
    // the information they typed
    if (this.commands[command]) {
      // User submitted valid command or postback
      return command;
    } else if (this._processMessage(command)) {
      // User submitted data, like an email address
      return this._processMessage(command);
    }

    // Default command if nothing else is found, including no command at all
    return 'get_started';
  }

  _findOverride(Event) {
    // Command user gave isn't ready to fire yet.  Find out what conditions
    // are failing and run the necessary commands to rectify.

    // The importance of this step is bots need to be fluid.  They shouldn't
    // lock users into a certain loop.  Using this pattern means the user can
    // navigate away from the current command if they want to.  However, if they
    // try to offending command again, they'll be sent back to whatever conditions
    // were not met
    return this.conditions[Event.validatedCommand].action(Event).then(x => x);
  }

  async _getResponse(Event) {
    // Override command is given priority.  Otherwise, run the validated command
    const command = Event.isOverridden
      ? this._findCommand(Event.override)
      : Event.validatedCommand;
    console.log('Running: ', command, ' Original: ', Event.command);
    console.log('Command: ', this.commands[command]);
    return await this.commands[command].call(this, Event);
  }

  _processMessage(message) {
    if (this._containsValidEmail(message)) {
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

  async _queueMessages(messages) {
    if (Array.isArray(messages)) {
      return this._flatten(messages);
      //this._handleArrayOfMessages(messages).then(m => this.queue.add(...m));
    } else {
      // If just one message, add it to queue (its promises has already been resolved)
      return [messages];
    }
  }

  _flatten(messages) {
    return Promise.all(messages).then(res =>
      res.reduce(
        (acc, m) =>
          acc.then(resolved => {
            if (Array.isArray(m)) {
              return this._flatten(m).then(r => {
                // Given a nested array, flatten it recursively.
                resolved.push(...r);
                return resolved;
              });
            } else {
              // Otherwise, just push into return array
              resolved.push(m);
              return resolved;
            }
          }),
        Promise.resolve([])
      )
    );
  }
}

module.exports = new Dispatch();
