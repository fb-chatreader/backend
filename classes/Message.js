const axios = require('axios');

module.exports = class Message {
  constructor(responses, event) {
    this.responses = responses;
    this.sender = event.sender.id;
  }

  send() {
    // This function tackles a few conditions.  `this.responses` could be a promise or not.
    // The promise could resolve to an array of responses or a single response.

    // .send() figures out if it's a promise or not.
    // ._processMessage will determine if it's an array or single object
    // ._apiCall will take an individual response object and send it to the Messenger API
    if (this.responses[0] && Array.isArray(this.responses[0])) {
      this.responses = [...this.responses[0], ...this.responses.slice(1)];
    }
    if (this.responses.then || (this.responses[0] && this.responses[0].then)) {
      const wasNestedPromise = this.responses.then ? false : true;
      const promise = this.responses.then
        ? this.responses
        : this.responses.shift();
      promise.then(messages => {
        // console.log('MESSAGES: ', messages);
        if (messages) {
          this.responses = wasNestedPromise
            ? [messages, ...this.responses]
            : messages;
          this._processMessage();
        } else return;
      });
    } else {
      // console.log('Not a promise: ', this.responses);
      // Otherwise just continue the loop
      if (this.responses) {
        this._processMessage();
      } else return;
    }
  }

  async _processMessage() {
    if (Array.isArray(this.responses)) {
      // If array, continue loop
      this._apiCall(this.responses.shift()).then(_ => {
        // Remove message from array, loop back around for the next message
        // AFTER sending the first
        if (this.responses.length) {
          this.send();
        } else {
          console.log('Message sent!');
        }
      });
    } else {
      this._apiCall(this.responses);
      console.log('Message sent!');
    }
  }

  async _apiCall(message) {
    // Send a single message object to the Facebook API

    if (message && message.attachment && message.attachment.payload) {
      console.log('SENDING: ', message.attachment.payload.elements);
    } else {
      console.log('OTHER SENDING: ', message);
    }
    if (message) {
      const msgObj = {
        recipient: {
          id: this.sender
        },
        message
      };
      const url = `https://graph.facebook.com/v2.6/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`;
      await axios
        .post(url, msgObj)
        .catch(err => console.log('Error sending Response: ', err.toJSON));
    } else return;
  }
};
