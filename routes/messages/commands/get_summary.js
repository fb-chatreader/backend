const Users = require('../../../models/db/users.js');
const ChatReads = require('../../../models/db/chatReads.js');
const Summaries = require('../../../models/db/summaryParts.js');
const timedMessages = require('../../../models/db/timedMessages.js');

// Query database to get current summary location
// If there isn't one, create it
// Otherwise, increment and get next summary (check for end of book)

module.exports = async event => {
  /* HARD CODED */
  const user_id = 1; // await Users.retrieve({ facebook_id: event.sender.id }).first(); // then get the ID
  /* HARD CODED */
  const book_id = 1;

  const chatread = await ChatReads.retrieve({ user_id, book_id }).first();
  console.log(chatread);

  /* HARD CODED */
  let current_summary_id = chatread ? chatread.current_summary_id : 1;
  console.log(chatread.current_summary_id);
  console.log(current_summary_id);

  const summaries = await Summaries.retrieveBlock(
    { book_id },
    current_summary_id
  );

  const next_summary_id = current_summary_id + summaries.block.length;
  await ChatReads.edit(
    { user_id, book_id },
    {
      current_summary_id: summaries.final
        ? next_summary_id - 1
        : next_summary_id
    }
  );

  return summaries.block.map((s, i) => {
    if (i < summaries.block.length - 1) {
      return {
        text: s.summary
      };
    } else {
      // summaries.final will be true if the block contains the final summary
      // Thus, send a different button
      return summaries.final
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
    isComplete,
    send_at: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
  };
  timedMessage
    ? await timedMessages.update({ user_id }, newMsg)
    : await timedMessages.write(newMsg);
}

/*
text =
      'We hope you enjoyed the summary!  Would you like to find another book?';
    buttons = [
      {
        type: 'postback',
        title: 'Synopsis',
        payload: 'get_synopsis'
      }
    ];

    text = next_summary.summary;
    next_part = current_summary_id + 1;
    buttons = [
      {
        type: 'postback',
        title: 'Continue',
        payload: 'get_summary'
      }
    ];

    await ChatReads.edit(
    { user_id: 1, book_id: 1 },
    { current_summary_id: next_part }
  );

   return ;
    */
