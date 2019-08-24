const books = require('./ipsumBookData/');

exports.seed = function(knex, Promise) {
  // del entries
  return knex('summary_parts')
    .del()
    .then(() => knex('summary_parts').insert(getSummaries()));
};

function getSummaries(num) {
  const limit = 320;
  // const getID = (id => () => ++id)(0);
  let summaries = [];

  books.forEach((book, b_id) => {
    const text = book.summary;
    let current = '';
    const sentences = text.split('. ');
    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];
      if ((current + '. ' + sentence).length <= limit - 1) {
        current += '. ' + sentence;
      } else {
        summaries.push({
          // id: getID(),
          book_id: b_id + 1,
          summary: current + '.',
          created_at: new Date()
        });
        if (num && summaries.length >= num) {
          return summaries;
        }
        current = '';
      }
    }
    if (current.length) {
      summaries.push({
        // id: getID(),
        book_id: b_id + 1,
        summary: current + '.',
        created_at: new Date()
      });
    }
  });
  return summaries;
}

/*

Static Shoe Dog Content:
const text = require('./bookSummary/').join('  ');

exports.seed = function(knex, Promise) {
  // del entries
  return knex('summary_parts')
    .del()
    .then(function() {
      return knex('summary_parts').insert(getSummaries());
    });
};

function getSummaries(num) {
  const limit = 320;
  const getID = (id => () => ++id)(0);
  let summaries = [];
  let current = '';
  const sentences = text.split('  ');

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    if ((current + ' ' + sentence).length <= limit) {
      current += ' ' + sentence;
    } else {
      summaries.push({
        id: getID(),
        book_id: 1,
        summary: current,
        created_at: new Date()
      });
      if (num && summaries.length >= num) {
        return summaries;
      }
      current = '';
    }
  }
  return summaries;
}

*/
