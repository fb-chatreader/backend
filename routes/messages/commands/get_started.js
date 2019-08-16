const Command = require('../classes/Command.js');
const ChatReads = require('../../../models/db/chatReads.js');

module.exports = async event => {
  /* HARD CODED */
  await ChatReads
  .write({ user_id: 1, book_id: 1 }, { current_summary_id: 1 })
  .catch(function(err) {
    console.log(err)
  })
  const response = {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: [
          {
            title: 'Shoe Dog',
            image_url: 'https://cdn1.imggmi.com/uploads/2019/8/16/0157bb1918ef12d284b5061e3153ddd5-full.png',
            subtitle: 'by Phil Knight',
            buttons: [
              {
                type: 'postback',
                title: 'Synopsis',
                payload: 'get_synopsis'
              }
            ]
          }
        ]
      }
    }
  };

  new Command(response, event).sendResponse();
};
