const reqDir = require('require-dir');

class Queue {
  // Standard linked list queue
  constructor() {
    this.head;
    this.tail;
    this.length = 0;
  }

  add(...args) {
    args.forEach(value => {
      const newNode = { value, next };
      if (!this.length) {
        this.head = newNode;
        this.tail = newNode;
      } else {
        const lastNode = this.head;
        lastNode.prev = newNode;
        this.head = newNode;
      }
      this.length++;
    });
  }

  next() {
    if (this.length) {
      const next = this.tail;
      this.tail = next.prev;
      this.length--;

      if (!this.length) {
        this.head = undefined;
      }
      return next.value;
    } else {
      return null;
    }
  }
}

class Dispatch {
  /*
    Dispatcher holds all the current commands as well as what they need in order to run.
    If you execute a command, it will verify that command passes all conditions before
    sending.  In the event a condition fails, it will instead dispatch a command to fix
    the issue.
  */
  constructor() {
    this.commands = reqDir('../routes/messages/commands/');
    this.templates = reqDir('../routes/messages/Templates/');
    this.conditions = reqDir('../routes/messages/conditions/');
    this.db = reqDir('../models/db/');
    this.helpers = reqDir('../routes/messages/helpers');

    this.queue = new Queue();
  }

  async execute(Event) {
    Event.validateCommand(this._findCommand(Event));
    await this._validateConditions(Event);

    Event.setResponse(this._getResponse(Event));
    if (Event.willRespond) {
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

    return dbs;
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

  async respond(Event) {
    // If the response isn't a promise, make it one.
    // Now we can always assume it's a promise.
    Event.response = Promise.resolve(this.response);

    const resolved = await Event.response;

    if (!resolved) {
      console.error(
        `No response sent to user.  ${this.command} returned: ${resolved}`
      );
      return;
    }
    this._messageQueue(resolved);
    this._sendToMessengerAPI(Event);
  }

  _findCommand(Event) {
    // This method is necessary since sometimes what the user types isn't a command
    // For example, if they type an email, the bot has to figure out to run save_email with
    // the information they typed
    if (this._isValidCommand(Event.command)) {
      // User submitted valid command or postback
      return Event.command;
    } else if (this._processMessage(Event.command)) {
      // User submitted data, like an email address
      return this._processMessage(Event.command);
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

  async _validateConditions(Event) {
    const conditions = this.conditions[Event.validatedCommand];
    if (conditions) {
      // Set to a promise in case forgets to make a condition async
      return Promise.resolve(conditions(Event)).then(r => r);
    } else {
      return true;
    }
  }

  _getResponse(Event) {
    // Override command is given priority.  Otherwise, run the validated command
    const command = Event.override
      ? this._findCommand(Event.override)
      : Event.validatedCommand;
    return this.commands[command].call(this, Event).then(r => r);
  }

  _isValidCommand(command) {
    return this.commands[command];
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

  _queueMessages(resolved) {
    if (Array.isArray(resolved[0])) {
      // If given nested arrays, recursively flatten it
      this._queueMessages(resolved.shift());
      this._queueMessages(resolved);
    } else if (Array.isArray(resolved)) {
      // Given an array, spread it into the queue
      this.queue.add(...resolved);
    } else {
      // or just simply add it to the queue
      this.queue.add(resolved);
    }
  }

  async _sendToMessengerAPI(Event) {
    // Send a single message object to the Facebook API
    let message = this.queue.next();
    while (message !== null) {
      // Sometimes for a buggy command, the response from it will be empty.
      // The if/else statement below exists solely to help debug that case.
      if (message) {
        const msgObj = {
          recipient: {
            id: this.sender
          },
          message
        };
        const url = `https://graph.facebook.com/v2.6/me/messages?access_token=${this.access_token}`;
        axios
          .post(url, msgObj)
          .then(x => x)
          .catch(err =>
            console.error(
              `Error when sending response from ${Event.override ||
                Event.validatedCommand} : `,
              err.response ? err.response.data : err
            )
          );
      } else {
        console.error(
          'Error: No message to send from: ',
          Event.override || Event.validatedCommand
        );
      }
    }
  }
}

module.exports = new Dispatch();
