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
    while (this.length) {
      const message = this._next();
      console.log('MESSAGE: ', message);
      if (message) {
        const msgObj = {
          recipient: {
            id: this.Event.sender_id
          },
          message
        };
        const url = `https://graph.facebook.com/v2.6/me/messages?access_token=${this.Event.access_token}`;
        axios
          .post(url, msgObj)
          .then(x => x)
          .catch(err =>
            console.error(
              `Error when sending response from ${this.Event.override ||
                this.Event.validatedCommand} : `,
              err.response ? err.response.data : err
            )
          );
      } else {
        console.error(
          'Error: No message to send from: ',
          this.Event.override || this.Event.validatedCommand
        );
      }
    }
    console.log('Messages Sent');
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
};
