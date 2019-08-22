const ChatReads = require('../../../models/db/chatReads.js');
const Books = require('../../../models/db/books.js');
const Users = require('../../../models/db/users.js');
const getUserInfo = require('../util/asycFunctions');

// Verify users exists already, if not save their Facebook ID
// Short term: reset current_summary of the book, fetch book from DB, display get Synopsis option
// Long term: Suggest books / categories for user to select

module.exports = async event => {
  const user = await Users.retrieveOrCreate({ facebook_id: event.sender.id });

  /* HARD CODED */
  const book_id = 1;
  const book = await Books.retrieve({ id: book_id }).first();
  await ChatReads.editOrCreate(
    { user_id: user.id, book_id },
    { current_summary_id: 1 }
  );
  let user_info;
  try {
    user_info = await getUserInfo(event.sender.id);
  } catch (err) {
    if (process.env.DB_ENVIRONMENT !== 'testing') console.log(err);
  }
  const book_intro = user_info
    ? `Hi, ${user_info.first_name}! ${book.intro}`
    : book.intro;

  return [
    {
      text: book_intro
    },
    {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [
            {
              title: book.title,
              image_url: book.cover_img,
              subtitle: `by ${book.author}`,
              buttons: [
                {
                  type: 'postback',
                  title: 'Quick Synopsis',
                  payload: 'get_synopsis'
                },
                {
                  type: 'postback',
                  title: 'Read Now',
                  payload: 'get_summary'
                }
              ]
            }
          ]
        }
      }
    }
  ];
};
