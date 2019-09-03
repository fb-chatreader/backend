const Users = require('models/db/users.js');
const ChatReads = require('models/db/chatReads.js');
const Summaries = require('models/db/summaryParts.js');
const timedMessages = require('models/db/timedMessages.js');

// Query database to get current summary location
// If there isn't one, create it
// Otherwise, increment and get next summary (check for end of book)

module.exports = async input => {
  // Collect needed data from DB
  const book_id = input.book_id;
  const user = await Users.retrieve({ facebook_id: input.sender.id }).first();
  const user_id = user.id;
  const chatread = await ChatReads.retrieve({ user_id, book_id }).first();
  // Get the user's current chat read summary_id or if they don't have one,
  // Set to the current book's first summary_id
  let current_summary_id = chatread ? chatread.current_summary_id : null;
  if (!chatread) {
    const firstSummary = await Summaries.retrieve({ book_id }).first();
    current_summary_id = firstSummary.id;
  }

  const summaries = await Summaries.retrieveBlock(
    { book_id },
    current_summary_id
  );

  // For the next round, update to the next summary_id (which will just be
  // the last id in the series if there are no more for the current book)
  const next_summary_id = current_summary_id + summaries.block.length;
  await ChatReads.editOrCreate(
    { user_id, book_id },
    {
      current_summary_id: summaries.isFinal
        ? next_summary_id - 1
        : next_summary_id
    }
  );

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
  const timedMessage = await timedMessages.retrieve({ user_id }).first();
  const newMsg = {
    user_id,
    book_id,
    isComplete
  };
  if (!timedMessage) {
    await timedMessages.add(newMsg);
  }
}
