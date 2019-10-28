const Books = require('models/db/books.js');

const get_started = require('./get_started.js');
const BookTemplate = require('../Templates/Book.js');

module.exports = async Event => {
  if (Event.type !== 'referral' && Event.type !== 'postback') {
    // Must be a referral or postback
    return;
  }
  const book = await Books.retrieve({
    'b.id': Event.book_id,
    'b.page_id': Event.page.id
  }).first();

  if (!book) {
    return get_started(Event);
  }

  return [await BookTemplate(Event, book)];
};
