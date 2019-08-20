const ChatReads = require('../../../models/db/chatReads.js');
const Books = require('../../../models/db/books.js');
const Users = require('../../../models/db/users.js');
const request = require('request')
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN


// Verify users exists already, if not save their Facebook ID
// Short term: reset current_summary of the book, fetch book from DB, display get Synopsis option
// Long term: Suggest books / categories for user to select

module.exports = async event => {
  let user = await Users.retrieveOrCreate({ facebook_id: event.sender.id });


  /* HARD CODED */
  const book_id = 1;
  const book = await Books.retrieve({ id: book_id }).first();

  await ChatReads.editOrCreate(
    { user_id: user.id, book_id },
    { current_summary_id: 1 }
  );


    let PSID = user.facebook_id;
    request.get(
      {
        uri: `https://graph.facebook.com/${PSID}`,
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN }, 
        method: 'GET'
      },
      (err, res) => {
        if(!err && res.statusCode === 200) {
          let userInfo = JSON.parse(res.body)
          console.log(userInfo.first_name, 'First Name');
        } 
      });

  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: [
          {
            title: `Hi ${userInfo.first_name},I\'m Phil Knight and I\'m the founding CEO of Nike.`,
            subtitle: `I wanted to share with you a quick preview of my book Shoe Dog`,
            image_url:
              'https://cdn1.imggmi.com/uploads/2019/8/19/31e08cd0fb2b8cef8a946c7ea4a28a0e-full.png',
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
