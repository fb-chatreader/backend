const ChatReads = require('../../../models/db/chatReads.js');
const Books = require('../../../models/db/books.js');
const Users = require('../../../models/db/users.js');
const request = require('request');
const axios = require('axios');
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;



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
//   let user_info;
//   const book_intro = user_info
//     ? `Hi, ${user_info.first_name}! ${book.intro}`
//     : book.intro;


    // let PSID = user.facebook_id;
    
    async function getFirst(PSID) {
        try {
          const userInfo = await axios.get(`https://graph.facebook.com/${PSID}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`)
          // let firstName = JSON.parse(userInfo.first_name);
          // let lastName= JSON.parse(userInfo.last_name);
          // console.log(userInfo.data)
          return userInfo.data
        } catch (error) {
          console.log(error)
        }
      }
    
      let userInfo = await getFirst(event.sender.id);
      const book_intro = userInfo ? `Hi, ${userInfo.first_name}! ${book.intro}` : book_intro;

      return {
          attachment: {
              type: 'template',
              payload: {
                  template_type: 'button',
                  text: book_intro ? book_intro : book.title,
                  buttons: 
                  [
                      {
                        type: 'postback',
                        title: 'Get Started',
                        payload: 'get_started'
                      }
                  ]
            }
        }
    }
};