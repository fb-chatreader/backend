const axios = require('axios');

module.exports = class MessageQueue {
  // Standard linked list queue
  constructor(Event) {
    this.head;
    this.tail;
    this.length = 0;
    this.Event = Event;
  }

  add(...args) {
    args.forEach(value => {
      const newNode = { value, next: undefined };
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

  send() {
    this._getAllMessages()
      .reduce(
        (acc, message) =>
          acc
            .then(_ => {
              // This reduce pattern ensures acc is always a promise.  And since this block only runs
              // after the .then, it means the previous iteration is fulfilled before moving on to the next.
              // In English, this ensures that our messages send in order.
              if (message) {
                const msgObj = {
                  recipient: {
                    id: this.Event.sender_id
                  },
                  message
                };
                const url = `https://graph.facebook.com/v2.6/me/messages?access_token=${this.Event.access_token}`;
                return axios.post(url, msgObj);
              } else {
                // This block isn't needed for any functional reason but sometimes a command returns an empty message.
                // So this exists purely to aid in debugging
                console.error(
                  'Error: No message to send from: ',
                  this.Event.override || this.Event.validatedCommand
                );
                return Promise.resolve();
              }
            })
            .catch(err =>
              console.error(
                `Error when sending response from ${this.Event.override ||
                  this.Event.validatedCommand} : `,
                err.response ? err.response.data : err
              )
            ),
        Promise.resolve()
      )
      .then(_ => console.log('Messages Sent'));
  }

  _next() {
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

  _getAllMessages() {
    const messages = [];
    while (this.length) {
      const m = this._next();
      messages.push(m);
    }
    return messages;
  }
};
