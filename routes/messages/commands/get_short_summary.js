const Books = require('models/db/books.js');

const QRT = require('../Templates/QuickReply.js');
const SubscribeTemplate = require('../Templates/Subscribe.js');

const getSummaryParts = require('../../books/helpers/getSummaryParts.js');

module.exports = async Event => {
  const { book_id } = Event;

  if (!Event.canUserStartBook()) {
    return [SubscribeTemplate({ ...Event, command: 'start_book' })];
  }
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
            book_id,
            summaryLength: 'long',
            freePass: true
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
