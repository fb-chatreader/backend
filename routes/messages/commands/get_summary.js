const ChatReads = require('models/db/chatReads.js');
const Books = require('models/db/books.js');
const Summaries = require('models/db/summaryParts.js');
const UserTracking = require('models/db/userTracking.js');
const Users = require('models/db/users.js');

// Query database to get current summary location
// If there isn't one, create it
// Otherwise, increment and get next summary (check for end of book)

module.exports = async (event) => {
  if (event.type !== 'postback') return;
  // Collect needed data from DB

  const { user_id, book_id, user } = event;

  const chatRead = await ChatReads.retrieve({ user_id, book_id }).first();
  // Get the user's current chat read summary_id or if they don't have one,
  // Set to the current book's first summary_id

  let current_summary_id = chatRead ? chatRead.current_summary_id : null;
  if (!chatRead) {
    const firstSummary = await Summaries.retrieve({ book_id }).first();
    current_summary_id = firstSummary.id;

    // Increment book read count
    const { read_count } = await Books.retrieve({ id: book_id }).first();
    await Books.edit({ id: book_id }, { read_count: read_count + 1 });

    // If the chatRead doesn't exists, either create it or update it in user tracking
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
  } else if (!chatRead && user.credits === 0) {
    return { text: 'Please, subscribe to read more summaries.' };
  } else {
    // It already exists and we just need to update the current summary being tracked
    await UserTracking.edit({ user_id, book_id }, { last_summary_id: current_summary_id });
  }
  const summaries = await Summaries.retrieveBlock({ book_id }, current_summary_id);

  // For the next round, update to the next summary_id (which will just be
  // the last id in the series if there are no more for the current book)
  const next_summary_id = current_summary_id + summaries.block.length;

  // Is this the final summary?  If so, delete their progress
  // If not, just update the table with the new ID
  // Otherwise, create a new chat read for the user for this book

  /**
   * /// Begin -- AJ's Ternary Hell
   */
  // chatRead
  //   ? summaries.isFinal
  //     ? await ChatReads.remove(chatRead.id)
  //     : await ChatReads.edit({ user_id, book_id }, { current_summary_id: next_summary_id })
  //   : await ChatReads.add({
  //       user_id,
  //       book_id,
  //       current_summary_id: next_summary_id
  //     });
  /**
   * /// End -- AJ's Ternary Hell
   */

  if (chatRead) {
    if (summaries.isFinal) {
      await ChatReads.remove(chatRead.id);
    } else {
      await ChatReads.edit({ user_id, book_id }, { current_summary_id: next_summary_id });
    }
  } else if (!chatRead) {
    await ChatReads.add({
      user_id,
      book_id,
      current_summary_id: next_summary_id
    });
  }

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
