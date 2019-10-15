const Books = require('models/db/books.js');

const get_started = require('./get_started.js');
const BookTemplate = require('../UI/BookTemplate.js');

module.exports = async event => {
  if (event.type !== 'referral') {
    // Must be a referral
    return;
  }

  const { user } = event;
  const book = await Books.retrieve({
    'b.id': event.book_id,
    'b.page_id': event.page.id
  }).first();

  if (!book) {
    return get_started(event);
  }

  if (!isSubscribed && !credits) {
    return [
      GenericTemplate([
        {
          title: 'Please subscribe to continue reading more book summaries!',
          image_url: 'https://i.imgur.com/UdZlgQA.png',
          buttons: [
            {
              type: 'web_url',
              url: process.env.FRONTEND_URL,
              title: 'Subscribe'
            }
          ]
        }
      ])
    ];
  }

  if (!isSubscribed) {
    // If the account is not subscribed, decrement credits
    await Users.edit({ id: user_id }, { credits: user.credits - 1 });
  }
  return [await BookTemplate(event, book)];
};
