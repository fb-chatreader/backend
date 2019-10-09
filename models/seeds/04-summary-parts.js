const books = require('./allBooks/books.json');
const getSummaryParts = require('routes/books/helpers/getSummaryParts.js');

exports.seed = function(knex) {
  const allBooks = books.reduce((acc, { summary }, i) => {
    const parts = getSummaryParts(summary).map(summary => ({
      book_id: i + 1,
      summary
    }));
    if (i === books.length - 1) {
    }
    acc.push(...parts);
    return acc;
  }, []);

  return knex('summary_parts').insert(allBooks);
};
