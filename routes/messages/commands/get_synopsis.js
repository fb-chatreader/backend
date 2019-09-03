const Books = require('models/db/books.js');

module.exports = async input => {
  const id = input.book_id;
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
