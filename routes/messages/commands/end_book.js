const Books = require('models/db/books.js');
const GenericTemplate = require('../Templates/Generic.js');

module.exports = async (Event) => {
  const { book_id } = Event;
  const book = await Books.retrieve({ 'b.id': book_id }).first();

  const user_info = await Event.getUserInfo();

  const title = `${user_info.first_name}, thank you for reading a quick summary of ${book.title}!`;

  const elements = {};

  elements.singleBook = [
    {
      title,
      subtitle: "if you'd like to read more books like this, check out Chatwise!",
      image_url: 'https://i.imgur.com/UdZlgQA.png',
      default_action: {
        type: 'web_url',
        url: process.env.MESSENGER_LINK
      },
      buttons: [
        {
          type: 'web_url',
          url: process.env.MESSENGER_LINK,
          title: 'Go to Chatwise'
        }
      ]
    }
  ];

  elements.multiBook = [
    {
      title,
      subtitle: 'What would you like to do next?',
      image_url: book.image_url,
      buttons: [
        {
          type: 'postback',
          payload: JSON.stringify({ command: 'browse' }),
          title: 'See more books'
        }
        // {
        //   type: 'web_url',
        //   title: 'Share',
        //   url: process.env.FRONTEND_URL
        // }
      ]
    }
  ];

  const page_status = Event.bookCount === 1 ? 'singleBook' : 'multiBook';

  return GenericTemplate(elements[page_status]);
};
