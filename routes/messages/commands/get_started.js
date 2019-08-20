const ChatReads = require('../../../models/db/chatReads.js');
const Books = require('../../../models/db/books.js');
const Users = require('../../../models/db/users.js');
const request = require('request');
const axios = require('axios');
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;


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
  /* INCOMPLETE - API CALL TO GET USER INFO */

  let PSID = user.facebook_id;
    
  async function getUserInfo(PSID) {
    const url = `https://graph.facebook.com/${PSID}?fields=first_name,last_name,profile_pic&access_token=${
      process.env.PAGE_ACCESS_TOKEN
    }`;
    const request = await axios.get(url);
    return request.data;
  }
  // let userInfo = await getUserInfo(event.sender.id);
  // const book_intro = userInfo ? `Hi, ${userInfo.first_name}! ${book.intro}` : book_intro;
  
  let user_info = await getUserInfo(event.sender.id);
  const book_intro = user_info
    ? `Hi, ${user_info.first_name}! ${book.intro}`
    : book.intro;

    
  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: [
          {
            title: book.title,
            image_url:
              'https://cdn1.imggmi.com/uploads/2019/8/19/31e08cd0fb2b8cef8a946c7ea4a28a0e-full.png',
            subtitle: `${book.author}`,
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
  };
};
