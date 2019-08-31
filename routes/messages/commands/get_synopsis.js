const Command = require('../classes/Command.js');
const Books = require('../../../models/db/books.js');
module.exports = async event => {
  const id = event.book_id;
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
            payload: JSON.stringify({
              command: 'get_summary',
              book_id: id
            })
          }
        ]
      }
    }
  };
};
