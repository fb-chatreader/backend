const Command = require('../classes/Command.js');

module.exports = async event => {
  return {
    persistent_menu: [
      {
        locale: 'default',
        composer_input_disabled: false, //true won't allow users to do text inputs
        call_to_actions: [
          {
            type: 'postback',
            title: 'Talk to an agent',
            payload: 'CARE_HELP'
          },
          {
            type: 'postback',
            title: 'Outfit suggestions',
            payload: 'CURATION'
          },
          {
            type: 'web_url',
            title: 'Shop now',
            url: 'https://www.originalcoastclothing.com/',
            webview_height_ratio: 'full'
          }
        ]
      }
    ]
  };
  //   new Command(response, event).sendResponse();
};
