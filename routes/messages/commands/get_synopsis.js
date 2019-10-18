const Books = require('models/db/books.js');

module.exports = async event => {
  const { book_id } = event;
  const book = await Books.retrieve({ 'b.id': book_id }).first();
  return [
    {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: book.synopsis,
          buttons: [
            {
              type: 'postback',
              title: 'Continue to Summary',
              payload: JSON.stringify({
                command: 'get_summary',
                book_id
              })
            }
          ]
        }
      }
    }
  ];
};
