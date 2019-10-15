const books = require('./allBooks/books.js');
const getRating = require('routes/books/helpers/getRating.js');

exports.seed = function(knex) {
  // delete all entries
  const page_id = process.env.PAGE_ID;

  return knex('books').insert(
    books.map(book => {
      // if (!book.rating_qty || !book.avg_rating) {
      //   book = await getRating(book);
      // }
      const {
        title,
        author,
        synopsis,
        intro,
        image_url,
        rating_qty,
        avg_rating
      } = book;

      return {
        title,
        author,
        synopsis,
        intro: intro || null,
        image_url: image_url || 'https://i.imgur.com/pRMQU6d.jpg',
        page_id,
        avg_rating: avg_rating || 0,
        rating_qty: rating_qty || 0
      };
    })
  );
};
