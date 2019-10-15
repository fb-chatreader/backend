const books = require('./allBooks/books.js');
const getSummaryParts = require('routes/books/helpers/getSummaryParts.js');

exports.seed = function(knex) {
  const allSummaries = books.reduce((acc, { summary }, i) => {
    const parts = getSummaryParts(summary).map(summary => ({
      book_id: i + 1,
      summary
    }));
    if (i === books.length - 1) {
    }
    acc.push(...parts);
    return acc;
  }, []);
  // There is a limit to how much data can be inserted at one time and we
  // breach that limit.  So for now, cutting the inserts in half and doing two of them
  const half = Math.round(allSummaries.length / 2);
  return knex('summary_parts')
    .insert(allSummaries.slice(0, half))
    .returning('id')
    .then(() => knex('summary_parts').insert(allSummaries.slice(half)));
};
