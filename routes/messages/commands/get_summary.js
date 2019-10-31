const ChatReads = require('models/db/chatReads.js');
const Books = require('models/db/books.js');
const Summaries = require('models/db/summaryParts.js');

const get_synopsis = require('./get_synopsis.js');

module.exports = async function(Event) {
  const { user_id, book_id } = Event;
  const allSummaries = await Summaries.retrieve({ book_id }).orderBy('id');
  const chatRead = await ChatReads.retrieve({ user_id, book_id }).first();

  let current_summary_id;
  if (!chatRead) {
    // Triggers when starting a book (first time or re-reads)
    if (Event.bookCount > 1) {
      // Before proceeding with a new book, verify the user is subscribed or has a credit
      if (!Event.canUserStartBook()) {
        return this.sendTemplate('Subscribe', {
          ...Event,
          command: 'start_book'
        });
      }
    }

    current_summary_id = allSummaries[0].id;

    // Increment book read count
    const { read_count } = await Books.retrieve({ 'b.id': book_id }).first();
    await Books.edit({ id: book_id }, { read_count: read_count + 1 });

    await ChatReads.add({
      user_id,
      book_id,
      current_summary_id
    });
    // Get synopsis before starting the book
    if (Event.bookCount > 1) {
      return get_synopsis(Event);
    }
  } else {
    current_summary_id = chatRead.current_summary_id;
  }

  const summaries = await Summaries.retrieveBlock(
    { book_id },
    current_summary_id
  );
  // Update users progress in tracking table
  await Event.updateUserTracking(current_summary_id);

  // Is this the final summary?  If so, delete their progress
  // If not, just update the table with the new ID
  const next_summary_id = current_summary_id + summaries.block.length;
  chatRead && summaries.isFinal
    ? await ChatReads.remove(chatRead.id)
    : await ChatReads.edit(
        { user_id, book_id },
        { current_summary_id: next_summary_id }
      );

  return summaries.block.map((s, i) => {
    if (i < summaries.block.length - 1) {
      // For every summary except the last, just send the text
      return {
        text: s.summary
      };
    } else {
      const title = summaries.isFinal
        ? 'Finish'
        : `Continue to ${next_summary_id - allSummaries[0].id + 1}/${
            allSummaries.length
          }`;

      const payload = JSON.stringify({
        command: summaries.isFinal ? 'end_book' : 'get_summary',
        book_id
      });
      // summaries.isFinal will be true if the block contains the final summary
      // Thus, send a different button
      return this.sendTemplate('QuickReply', s.summary, [{ title, payload }]);
    }
  });
};
