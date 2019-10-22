const axios = require('axios');

module.exports = class Message {
  constructor(event) {
    this.response;
    this.event = event;
    this.sender = event.sender;
    this.access_token = event.page.access_token;
  }

  async respond() {
    if (!this.response) return;
    // The response object must be an array.
    // However it could:
    // 1) Be a promise  --> this.response.then is truthy
    // 2) Not be a promise --> this.response.then is falsey
    // 3) Contain an array of promises --> this.response.then is falsey but this.response[0].then is truthy
    if (this.response.then || this.response[0].then) {
      const resolved = await this._resolvePromises();
      if (!resolved) {
        console.error(
          `No response sent to user.  ${this.event.command} returned: ${resolved}`
        );
        return;
      }
      this._messageQueue(resolved);
    } else {
      this._messageQueue(this.response);
    }
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
            `Error: received an array for a message from ${event.command}`
          )
        : console.error('Error: No message to send!');
    }
  }
};
