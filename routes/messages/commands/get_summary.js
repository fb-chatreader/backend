const Users = require('../../../models/db/users.js');
const ChatReads = require('../../../models/db/chatReads.js');
const Summaries = require('../../../models/db/summaryParts.js');
const timedMessages = require('../../../models/db/timedMessages.js');

// Query database to get current summary location
// If there isn't one, create it
// Otherwise, increment and get next summary (check for end of book)

module.exports = async event => {
  /* HARD CODED */
  const user = await Users.retrieve({ facebook_id: event.sender.id }).first(); // then get the ID
  const user_id = user.id;
  /* HARD CODED */
  const book_id = 1;

  const chatread = await ChatReads.retrieve({ user_id, book_id }).first();

  /* HARD CODED */
  const current_summary_id = chatread ? chatread.current_summary_id : 1;

  const summaries = await Summaries.retrieveBlock(
    { book_id },
    current_summary_id
  );

  const next_summary_id = current_summary_id + summaries.block.length;
  await ChatReads.edit(
    { user_id, book_id },
    {
      current_summary_id: summaries.isFinal
        ? next_summary_id - 1
        : next_summary_id
    }
  );
  updateTimedMessages(user_id, book_id, summaries.isFinal);

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
                    payload: 'amazon_link'
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
                    payload: 'get_summary'
                  }
                ]
              }
            }
          };
    }
  });
};

async function updateTimedMessages(user_id, book_id, isComplete = false) {
  const timedMessage = await timedMessages.retrieve({ user_id }).first();
  const newMsg = {
    user_id,
    book_id,
    isComplete
  };
  timedMessage
    ? await timedMessages.update({ user_id }, newMsg)
    : await timedMessages.write(newMsg);
}
