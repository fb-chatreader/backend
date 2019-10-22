const Books = require('models/db/books.js');
const QRT = require('../UI/QuickReplyTemplate.js');

module.exports = (progress => event => {
  const { user_id, book_id } = event;
  if (!progress[user_id]) {
    progress[user_id] = { [book_id]: 0 };
  } else if (!progress[user_id][book_id]) {
    progress[user_id][book_id] = 0;
  }

  const book = Books.retrieve({ 'b.id': book_id }).first();
  const start = progress[user_id][book_id];
  const end = start + process.env.BLOCK_LENGTH || 3;

  const summaries = JSON.parse(book.shortSummary);
  const messages = summaries.slice(start, end);

  const isFinal = end >= summaries.length;
  progress[user_id][book_id] = isFinal ? 0 : end;

  return messages.map((text, i) => {
    if (i < messages.length - 1) {
      return [{ text }];
    } else {
      const title = isFinal ? 'Read Long Summary' : 'Continue';
      const payload = JSON.stringify({
        command: isFinal ? 'get_summary' : 'get_short_summary',
        book_id
      });

      const buttons = [{ title, payload }];

      if (isFinal) {
        buttons.push({
          title: 'Browse More Books',
          payload: JSON.stringify({ command: 'browse' })
        });
      }
      return [QRT(text, buttons)];
    }
  });
})({});
