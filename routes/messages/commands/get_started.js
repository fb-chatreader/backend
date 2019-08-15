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
