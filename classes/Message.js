const axios = require('axios');

module.exports = class Message {
  constructor(event) {
    this.response;
    this.event = event;
    this.sender = event.sender;
    this.access_token = event.client.access_token;
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
    console.log('RESOLVED: ', resolved);
    if (Array.isArray(resolved[0])) {
      resolved = [...resolved[0], resolved.slice(1)];
    }
    const message = resolved.shift();

    await this._sendToMessengerAPI(message);

    if (resolved.length) {
      this._messageQueue(resolved);
    } else console.log('Message Sent');
  }

  async _sendToMessengerAPI(message) {
    // Send a single message object to the Facebook API
    if (message) {
      const msgObj = {
        recipient: {
          id: this.sender
        },
        message
      };
      const url = `https://graph.facebook.com/v2.6/me/messages?access_token=${this.access_token}`;
      await axios
        .post(url, msgObj)
        .catch(err =>
          console.log('Error sending Response: ', err.response.data)
        );
    } else return;
  }
};
