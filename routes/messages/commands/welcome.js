const Command = require('../classes/Command.js');
const ChatReads = require('../../../models/db/chatReads.js');

module.exports = async event => {

  const response = {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: [
          {
            title: 'Welcome to Chat Reader',
            image_url: 'https://cdn1.imggmi.com/uploads/2019/8/16/0157bb1918ef12d284b5061e3153ddd5-full.png',
            subtitle: 'Here you will be able to read while you are on the go',
            buttons: [
              {
                type: 'postback',
                title: 'get started',
                payload: 'get_started'
              }
            ]
          }
        ]
      }
    }
  };

  new Command(response, event).sendResponse();
};
