const ChatReads = require('models/db/chatReads.js');
const Books = require('models/db/books.js');
const Summaries = require('models/db/summaryParts.js');
const TimedMessages = require('models/db/timedMessages.js');
const UserTracking = require('models/db/userTracking.js');

// Query database to get current summary location
// If there isn't one, create it
// Otherwise, increment and get next summary (check for end of book)

module.exports = async event => {
  if (event.type !== 'postback') return;
  // Collect needed data from DB
  const { user_id, book_id } = event;
  const chatread = await ChatReads.retrieve({ user_id, book_id }).first();
  // Get the user's current chat read summary_id or if they don't have one,
  // Set to the current book's first summary_id

  let current_summary_id = chatread ? chatread.current_summary_id : null;
  if (!chatread) {
    const firstSummary = await Summaries.retrieve({ book_id }).first();
    current_summary_id = firstSummary.id;

    // Increment book read count
    const { read_count } = await Books.retrieve({ id: book_id }).first();
    await Books.edit({ id: book_id }, { read_count: read_count + 1 });

    // If the chatread doesn't exists, either create it or update it in user tracking
    const progressOnBook = await UserTracking.retrieve({
      user_id,
      book_id
    }).first();

    !progressOnBook
      ? await UserTracking.add({
          user_id,
          book_id,
          last_summary_id: current_summary_id
        })
      : await UserTracking.edit(
          { user_id, book_id },
          {
            last_summary_id: current_summary_id,
            repeat_count: progressOnBook.repeat_count + 1
          }
        );
  } else {
    // It already exists and we just need to update the current summary being tracked
    await UserTracking.edit(
      { user_id, book_id },
      { last_summary_id: current_summary_id }
    );
  }

  const summaries = await Summaries.retrieveBlock(
    { book_id },
    current_summary_id
  );

  // For the next round, update to the next summary_id (which will just be
  // the last id in the series if there are no more for the current book)
  const next_summary_id = current_summary_id + summaries.block.length;

  // Check if the user has an active chat read
  const chatRead = await ChatReads.retrieve({ user_id, book_id }).first();

  // Is this the final summary?  If so, delete their progress
  // If not, just update the table with the new ID
  // Otherwise, create a new chat read for the user for this book
  chatRead
    ? summaries.isFinal
      ? ChatReads.remove(chatRead.id)
      : ChatReads.edit({ user_id, book_id }, next_summary_id)
    : ChatReads.add({ user_id, book_id, current_summary_id });

  // Add 24 hour timer to send a follow up message
  addTimedMessages(user_id, book_id, summaries.isFinal);

  return summaries.block.map((s, i) => {
    if (i < summaries.block.length - 1) {
      return {
        text: s.summary
      };
    } else {
      // summaries.isFinal will be true if the block contains the final summary
      // Thus, send a different button
      return summaries.isFinal
        ? {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'button',
                text: s.summary,
                buttons: [
                  {
                    type: 'postback',
                    title: 'Finish',
                    payload: JSON.stringify({
                      command: 'buy_book',
                      book_id
                    })
                  }
                ]
              }
            }
          }
        : {
            attachment: {
              type: 'template',
              payload: {
                template_type: 'button',
                text: s.summary,
                buttons: [
                  {
                    type: 'postback',
                    title: 'Continue',
                    payload: JSON.stringify({
                      command: 'get_summary',
                      book_id
                    })
                  }
                ]
              }
            }
          };
    }
  });
};

async function addTimedMessages(user_id, book_id, isComplete = false) {
  // To better catch a user at the start of their free time,
  // only update timed messages if one doesn't already exists
  const timedMessage = await TimedMessages.retrieve({ user_id }).first();
  const newMsg = {
    user_id,
    book_id,
    isComplete
  };
  if (!timedMessage) {
    await TimedMessages.add(newMsg);
  }
}
