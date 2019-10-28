const axios = require('axios');
const reqDir = require('require-dir');
const addTimedMessage = require('routes/messages/helpers/addTimedMessage.js');

module.exports = class Message {
  constructor(event) {
    this.templates = reqDir('routes/messages/UI/');
    this.conditions = reqDir('routes/messages/conditions/');
    this.db = reqDir('models/db/');
    this.helpers = reqDir('routes/messages/helpers');

    const { sender, page, command, user_id, ...additionalData } = event;

    this.event = additionalData;
    this.user_id = user_id;
    this.command = command;
    this.sender = sender;
    this.page_id = page.id;
    this.access_token = page.access_token;

    this.willRespond = true; // Set to false if the command doesn't reply
    this.override;
    this.response;
  }

  execute() {}

  overrideCommand(command) {
    this.override = command;
  }

  async setConditions(...args) {
    for (let i = 0; i < args.length; i++) {
      const c = args[i];
      if (!this.conditions[c]) {
        console.error(`Warning: condition ${c} was not found.`);
        continue;
      }

      const condition = this.conditions[c];

      const passes = await condition.evaluate.call(this);
      if (!passes) {
        return await condition.action.call(this);
      }
    }
  }

  withDBs(...args) {
    const dbs = [];

    args.forEach(name => {
      dbs.push(this.db[name]);
    });

    return dbs;
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
};

// class Node {
//   constructor(value) {
//     this.value = value;
//     this.next;
//     this.prev;
//   }
// }

// class CommandQueue {
//   constructor(command) {
//     this.tail;
//     this.head;
//     this.original = command;
//     this.length = 0;
//   }

//   push(...args) {
//     // Can give this method any number of arguments and it'll insert them all in order
//     // Each argument must be a string
//     let lastNode = this.tail;
//     args.forEach(command => {
//       // Add each node to the tail end of the linked list
//       const newNode = new Node(command);
//       newNode.prev = lastNode;
//       if (lastNode) {
//         lastNode.next = newNode;
//       } else {
//         // This is the first insertion
//         this.head = newNode;
//       }
//       this.tail = newNode;
//       this.length++;
//       lastNode = newNode;
//     });
//   }

//   shift() {
//     if (this.length) {
//       // As long as the list has values, return the current head
//       const firstNode = this.head;
//       const secondNode = firstNode.next;
//       if (secondNode) {
//         // If this.head.next is undefined, skip this step
//         secondNode.prev = undefined;
//       }
//       this.head = secondNode;
//       this.length--;

//       if (this.length === 0) {
//         // If the last value was shifted, clear the tail value
//         // The head should already be undefined
//         this.tail = this.head;
//       }
//       return firstNode.value;
//     }

//     return null;
//   }

//   _returnOriginal() {
//     if (!this.original) {
//       return null;
//     }
//     const og = original;
//     this.original = undefined;
//     return og;
//   }
// }
