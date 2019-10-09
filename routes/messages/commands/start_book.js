const Books = require('models/db/books.js');

const get_started = require('./get_started.js');
const BookTemplate = require('../UI/BookTemplate.js');

module.exports = async event => {
  if (event.type !== 'referral') {
    // Must be a referral
    return;
  }
  const book = await Books.retrieve({
    'b.id': event.book_id,
    'b.page_id': event.page.id
  }).first();

  if (!book) {
    return get_started(event);
  }
  return [await BookTemplate(event, book)];
};
