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
  // const book_id = 1;
  const books = await Books.retrieve();
  // await ChatReads.editOrCreate(
  //   { user_id: user.id, book_id },
  //   { current_summary_id: 1 }
  // );
  // let user_info;
  // try {
  //   user_info = await getUserInfo(event.sender.id);
  // } catch (err) {
  //   if (process.env.DB_ENVIRONMENT !== 'testing') console.log(err);
  // // }
  // const book_intro = user_info
  //   ? `Hi, ${user_info.first_name}! ${book.intro}`
  //   : book.intro;

  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: books.map(b => {
          return {
            title: b.title,
            image_url: b.cover_img,
            subtitle: `by ${b.author}`,
            buttons: [
              {
                type: 'postback',
                title: 'Get Synopsis',
                payload: JSON.stringify({
                  command: 'get_synopsis',
                  book_id: b.id
                })
              },
              {
                type: 'postback',
                title: 'Start Summary',
                payload: JSON.stringify({
                  command: 'get_synopsis',
                  book_id: b.id
                })
              }
            ]
          };
        })
      }
    }
  };
};
