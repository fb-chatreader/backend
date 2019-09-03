const Books = require('models/db/books.js');
const getUserInfo = require('../helpers/getUserInfo.js');

module.exports = async input => {
  const books = await Books.retrieve();
  if (!books.length) {
    return {
      text:
        'Sorry, this bot is still being created, please visit us again soon!'
    };
  }
  return books.length > 1
    ? getMultipleBooks(input)
    : getSingleBook(input, books);
};

function getMultipleBooks() {}

async function getSingleBook(input, booksPromise) {
  const books = await booksPromise;
  const userInfo = await getUserInfo(input.sender.id);
  const { id: book_id, title, author, synopsis, intro, image_url } = books[0];

  const text = `Hi, ${userInfo.first_name}! ${intro}`;

  const buttons = [];
  if (synopsis) {
    buttons.push({
      type: 'postback',
      title: 'Quick Synopsis',
      payload: JSON.stringify({
        command: 'get_synopsis',
        book_id
      })
    });
  }

  buttons.push({
    type: 'postback',
    title: 'Read Now',
    payload: JSON.stringify({
      command: 'get_summary',
      book_id
    })
  });

  return [
    { text },
    {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [
            {
              title,
              image_url,
              subtitle: `by ${author}`,
              buttons
            }
          ]
        }
      }
    }
  ];
}
