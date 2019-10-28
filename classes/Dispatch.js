const reqDir = require('require-dir');

/* 
  Dispatcher holds all the current commands as well as what they need in order to run.
  If you execute a command, it will verify that command passes all conditions before
  sending.  In the event a condition fails, it will instead dispatch a command to fix
  the issue.
*/
class Dispatch {
  constructor() {
    this.commands = reqDir('../routes/messages/commands/');
    this.templates = reqDir('../routes/messages/Templates/');
    this.conditions = reqDir('../routes/messages/conditions/');
    this.db = reqDir('../models/db/');
    this.helpers = reqDir('../routes/messages/helpers');
  }

  async execute(Event) {
    Event.validateCommand(this._findCommand(Event));
    const commandReady = await this._validateConditions(Event);

    if (!commandReady) {
      Event.setOverride(await this._findOverride(Event));
    }

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

  _validateConditions(Event) {
    return this.conditions[Event.validatedCommand].evaluate(Event).then(x => x);
  }

  _getResponse(Event) {
    // Run the command returned by _findCommand and feed it the Event class
    return this.commands[Event.validatedCommand].call(this, Event);
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
