const axios = require('axios');

module.exports = class Command {
  constructor(responses, event) {
    this.responses = responses;
    this.sender = event.sender.id;
  }

  sendResponses() {
    // If the command returns a single object, we'll send just it.  Otherwise, we'll
    // loop over the array and send one at a time (recursively)

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
      this._send(this.responses.shift()).then(_ => {
        // Remove message from array, loop back around for the next message
        // AFTER sending the first
        if (this.responses.length) {
          this.sendResponses();
        } else {
          console.log('Message sent!');
        }
      });
    } else {
      this._send(this.responses);
      console.log('Message sent!');
    }
  }

  async _send(message) {
    const msgObj = {
      recipient: {
        id: this.sender
      },
      message
    };
    const url = `https://graph.facebook.com/v2.6/me/messages?access_token=${
      process.env.PAGE_ACCESS_TOKEN
    }`;
    await axios
      .post(url, msgObj)
      .catch(err => console.log('Error sending Response: ', err.toJSON));
  }
};
