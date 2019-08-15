const Command = require('../classes/Command.js');

module.exports = event => {
  const response = {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: [
          {
            title: 'Shoe Dog',
            subtitle: 'by Phil Knight',
            buttons: [
              {
                type: 'postback',
                title: 'Get Summary',
                payload: 'start_summary'
              }
              // {
              //   type: 'postback',
              //   title: 'No Thanks',
              //   payload: 'no'
              // }
            ]
          }
        ]
      }
    }
  };

  const command = new Command(response, event).sendResponse();
};
