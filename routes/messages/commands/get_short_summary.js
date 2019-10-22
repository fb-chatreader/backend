const Books = require('models/db/books.js');

const QRT = require('../UI/QuickReplyTemplate.js');

const getSummaryParts = require('../../books/helpers/getSummaryParts.js');

module.exports = async event => {
  const { user_id, book_id } = event;
  const { shortSummary } = await Books.retrieve({ 'b.id': book_id }).first();

  const summaries = getSummaryParts(JSON.parse(shortSummary).join(' '));
  return summaries.map((text, i) => {
    if (i < summaries.length - 1) {
      return { text };
    } else {
      const buttons = [
        {
          title: 'Read Long Summary',
          payload: JSON.stringify({
            command: 'get_summary',
            book_id
          })
        },
        {
          title: 'Browse More Books',
          payload: JSON.stringify({ command: 'browse' })
        }
      ];

      return QRT(text, buttons);
    }
  });
};
