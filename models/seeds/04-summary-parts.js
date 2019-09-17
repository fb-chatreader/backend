const books = require('./allBooks/books.json');
const getSummaryParts = require('routes/books/helpers/getSummaryParts.js');

exports.seed = function(knex) {
  return knex('summary_parts').insert(
    books.reduce((acc, { summary }, i) => {
      const parts = getSummaryParts(summary).map(summary => ({
        book_id: i + 1,
        summary
      }));
      return [...acc, ...parts];
    }, [])
  );
};
