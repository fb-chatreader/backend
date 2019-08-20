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
  /**
   console.log(chatread, '<<<<<<<<<<<<<<<<<')
   { id: 1,
  user_id: 1,
  book_id: 1,
  current_summary_id: 3,
  created_at: 2019-08-15T20:10:51.406Z,
  updated_at: null } '<<<<<<<<<<<<<<<<<'
   */
  let current_part = chatread ? chatread.current_summary_id : null;

  if (!current_part) {
    /* INCOMPLETE */
    // Create a new chat read in the database (only one right now so no need to code it)
    current_part = 1;
  }
  const nextSummary = await Summaries.retrieve({
    id: current_part + 1
  }).first();

  let text, next_part, buttons;

  if (!nextSummary || nextSummary.book_id !== book_id) {
    updateTimedMessages(user_id, book_id, true);
    // We've reached the end of our database or the next summary is a different book
    text =
      'We hope you enjoyed the summary!  Would you like to find another book?';
    buttons = [
      {
        type: 'postback',
        title: 'Synopsis',
        payload: 'get_synopsis'
      }
    ];
    /* HARD CODED */
    next_part = 1;
  } else {
    updateTimedMessages(user_id, book_id);

    // Grab next entry
    text = nextSummary.summary;
    next_part = current_part + 1;
    buttons = [
      {
        type: 'postback',
        title: 'Continue',
        payload: 'get_summary'
      }
    ];
  }

  await ChatReads.edit(
    { user_id: 1, book_id: 1 },
    { current_summary_id: next_part }
  );

  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'button',
        text: text,
        buttons
      }
    }
  };
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
