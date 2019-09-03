const axios = require('axios');

module.exports = class Command {
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

    if (this.responses.then) {
      // If responses is a promise, resolve it first
      this.responses.then(messages => {
        this.responses = messages;
        this._processMessage();
      });
    } else {
      // Otherwise just continue the loop
      this._processMessage();
    }
  }

  _processMessage() {
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
  }
};
