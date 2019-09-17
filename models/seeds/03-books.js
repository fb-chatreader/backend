const books = require('./allBooks/books.json');

exports.seed = function(knex) {
  // delete all entries
  const page_id = process.env.PAGE_ID;
  return knex('books').insert(
    books.map(({ title, author, synopsis, intro, image_url }) => {
      return {
        title,
        author,
        synopsis,
        intro: intro || null,
        image_url,
        page_id
      };
    })
  );
};
