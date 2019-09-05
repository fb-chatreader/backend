const text = require('./bookSummary').join('  ');

exports.seed = function(knex) {
  return knex('summary_parts').insert(getSummaries());
};

function getSummaries(num) {
  const limit = 320;
  let summaries = [];
  let current = '';
  const sentences = text.split('  ');

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    if ((current + ' ' + sentence).length <= limit) {
      current += ' ' + sentence;
    } else {
      summaries.push({
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
