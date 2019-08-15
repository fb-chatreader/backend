const request = require('request');

module.exports = class Command {
  constructor(response, event) {
    this.response = response;
    this.sender = event.sender.id;
  }

  sendResponse() {
    const request_body = {
      recipient: {
        id: this.sender
      },
      message: this.response
    };
    request(
      {
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: request_body
      },
      (err, res, body) => {
        if (!err) {
          console.log('Message sent!');
        } else {
          console.error('Unable to send message:' + err);
        }
      }
    );
  }
};
