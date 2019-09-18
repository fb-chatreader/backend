const books = require('./allBooks/books.json');

exports.seed = function(knex) {
  const categories = {};

  books.forEach(({ category: c }) => {
    if (!categories[c]) {
      categories[c] = true;
    }
  });
  // Objects aren't ordered so this is a little risky, but should work fine still
  const categoryID = Object.keys(categories);

  return knex('book_categories').insert(
    books.map(({ category }, i) => ({
      book_id: i + 1,
      category_id: categoryID.indexOf(category) + 1
    }))
  );
};
