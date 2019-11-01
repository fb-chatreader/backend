const Books = require('models/db/books.js');

const BookTemplate = require('../Templates/Book.js');

module.exports = async function(Event) {
  const canRead = Event.canUserStartBook();

  if (!canRead) {
    return this.sendTemplate('Subscribe', Event);
  }
  const book = await Books.retrieve({
    'b.id': Event.book_id,
    'b.page_id': Event.page_id
  }).first();

  return [await BookTemplate(Event, book)];
};