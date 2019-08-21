const axios = require('axios');

module.exports = class Command {
  constructor(responses, event) {
    this.responses = responses;
    this.sender = event.sender.id;
  }

  sendResponses() {
    // If the command returns a single object, we'll send just it.  Otherwise, we'll
    // loop over the array and send one at a time

    // Promise.all will collect all the promises returned by the commands and then when they
    // ALL resolve (or one fails), try send the messages in order
    this.responses.then(messages => {
      Array.isArray(messages)
        ? messages.forEach((message, i) => {
            setTimeout(this._send.bind(this, message), 200 * i);
          })
        : this._send(messages);
    });

    console.log('Message sent!');
  }

  _send(message) {
    const msgObj = {
      recipient: {
        id: this.sender
      },
      message
    };
    const url = `https://graph.facebook.com/v2.6/me/messages?access_token=${
      process.env.PAGE_ACCESS_TOKEN
    }`;
    axios
      .post(url, msgObj)
      .catch(err => console.log('Error sending Response: ', err.toJSON));
  }
};
