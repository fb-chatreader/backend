const books = require('./allBooks/books.js');

exports.seed = function(knex) {
  const categories = {};

  books.forEach(({ category: c }) => {
    if (!categories[c]) {
      categories[c] = true;
    }
  });

  return knex('categories').insert(
    Object.keys(categories).map(s => ({
      name: s,
      page_id: process.env.PAGE_ID
    }))
  );
};
