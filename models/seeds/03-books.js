const books = require('./allBooks/books.json');
const ratings = require('./allBooks/ratings.json');

exports.seed = function(knex) {
  // delete all entries
  const page_id = process.env.PAGE_ID;
  return knex('books').insert(
    books.map(({ title, author, synopsis, intro, image_url }, i) => {
      return {
        title,
        author,
        synopsis,
        intro: intro || null,
        image_url,
        page_id,
        avg_rating: ratings[i].avg_rating || 1.3,
        rating_qty: ratings[i].rating_qty || 1.5
      };
    })
  );
};
