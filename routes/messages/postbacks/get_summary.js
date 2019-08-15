const Command = require('../classes/Command.js');
const Users = require('../../../models/db/users.js');
const ChatReads = require('../../../models/db/chatReads.js');
const Summaries = require('../../../models/db/summaryParts.js');

module.exports = async event => {
  // Query database to get current summary location
  // If there isn't one, create it
  // Otherwise, increment and get next summary (check for end of book)
  const command = new Command(null, event);

  /* HARD CODED */
  const user_id = 1; // await Users.retrieve({ facebook_id: command.sender });
  /* HARD CODED */
  const book_id = 1;
  const chatread = await ChatReads.retrieve({ user_id, book_id }).first();
  let current_part = chatread ? chatread.current_summary_id : null;

  if (!current_part) {
    /* INCOMPLETE */
    // Create a new chat read in the database (only one right now so no need to code it)
    current_part = 1;
  }
  const nextSummary = await Summaries.retrieve({
    id: current_part + 1
  }).first();
  /* HARD CODED */
  let text = nextSummary ? nextSummary.summary : null;
  /* HARD CODED */
  let next_part = nextSummary ? current_part + 1 : 1;
  let buttons = [
    {
      type: 'postback',
      title: 'Continue',
      payload: 'get_summary'
    }
  ];
  if (!nextSummary || nextSummary.book_id !== book_id) {
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
  }

  const response = {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'button',
        text: text,
        buttons
      }
    }
  };
  command.response = response;
  command.sendResponse();
};
