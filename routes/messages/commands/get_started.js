// const ChatReads = require('../../../models/db/chatReads.js');
const Books = require('../../../models/db/books.js');
const Users = require('../../../models/db/users.js');
const getUserInfo = require('../util/asyncFunctions.js');

// Verify users exists already, if not save their Facebook ID
// Short term: reset current_summary of the book, fetch book from DB, display get Synopsis option
// Long term: Suggest books / categories for user to select

module.exports = async event => {
  const user = await Users.retrieveOrCreate({ facebook_id: event.sender.id });
  const books = await Books.retrieve();

  if (!books.length) return;
  // No "large" scale UI yet so last value is only "mid"
  console.log(books.length);
  return getResponseObject(
    books.length === 1 ? 'single' : books.length < 15 ? 'mid' : 'mid',
    books,
    event
  );
};

async function getResponseObject(size, books, event) {
  let user_info;
  try {
    // This try/catch is necessary until we find a work-around for the PSID.
    // It's unique to the page (page-specific ID), which our testing environment doesn't have
    user_info = await getUserInfo(event.sender.id);
  } catch (err) {
    if (process.env.DB_ENVIRONMENT !== 'testing') console.log(err);
  }

  const intro_text =
    books.length > 1
      ? 'Please select a book from the list below to begin reading its summary!'
      : books[0].intro;

  const book_intro = user_info
    ? `Hi, ${user_info.first_name}! ${intro_text}`
    : intro_text;

  const responses = {
    single: [
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
                title: books[0].title,
                image_url: books[0].cover_img,
                subtitle: `by ${books[0].author}`,
                buttons: [
                  {
                    type: 'postback',
                    title: 'Quick Synopsis',
                    payload: JSON.stringify({
                      command: 'get_synopsis',
                      book_id: books[0].id
                    })
                  },
                  {
                    type: 'postback',
                    title: 'Read Now',
                    payload: JSON.stringify({
                      command: 'get_summary',
                      book_id: books[0].id
                    })
                  }
                ]
              }
            ]
          }
        }
      }
    ],
    mid: [
      {
        text: book_intro
      },
      {
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
                      command: 'get_summary',
                      book_id: b.id
                    })
                  }
                ]
              };
            })
          }
        }
      }
    ]
  };

  return responses[size];
}

/*
Removed hard coded book address:
                default_action: {
                  type: 'web_url',
                  url:
                    'https://cdn1.imggmi.com/uploads/2019/8/22/76c10c3d1b579bf0a66cb7f1cfe74843-full.jpg',
                  webview_height_ratio: 'tall'
                },
                */
