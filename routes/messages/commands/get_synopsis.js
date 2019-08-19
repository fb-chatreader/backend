const Command = require('../classes/Command.js');
const Books = require('../../../models/db/books.js');
module.exports = async event => {
  // When this code is finalized, the id should be in the 'event' but for right now
  // We're hard coding until that UI is built out.

  /* HARD CODED */
  const id = 1;
  const book = await Books.retrieve({ id }).first();
  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'button',
        text: book.synopsis,
        buttons: [
          {
            type: 'postback',
            title: 'Start Summary',
            payload: 'get_summary'
          }
        ]
      }
    }
  };
};