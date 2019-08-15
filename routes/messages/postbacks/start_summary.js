const Command = require('../classes/Command.js');

module.exports = event => {
  // This needs to query the database to get the first summary
  const response = {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'button',
        text:
          "Hi, my name is Phil Knight and 'm the founding CEO of Nike. I wanted to share with you a quick preview of my book Shoe Dog.",
        buttons: [
          {
            type: 'postback',
            title: 'Next',
            payload: 'next'
          }
        ]
      }
    }
  };

  new Command(response, event).sendResponse();
};
