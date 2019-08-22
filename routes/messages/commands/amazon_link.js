const axios = require('axios');
const Books = require('../../../models/db/books.js');
const Users = require('../../../models/db/users.js');
const getUserInfo = require('../util/asycFunctions');

module.exports = async event => {
  // we have facebook id, 
  // from facebook id , we can get the userid,
  // can dynamically pass user id 
  // const user = await Users.retrieveOrCreate({ facebook_id: event.sender.id });
  //console.log(user.id, 'user');
  //console.log(event.sender.id, 'sender id');
  //const id = user.id;
  //will dynamically pass id 
  const id = 1;
  const book = await Books.retrieve({ id }).first();

  const user_info = await getUserInfo(event.sender.id);

  return [
    {
      text: `${
        user_info.first_name
      }, thank you for reading a quick summary of ${
        book.title
      }, I hope you liked it! You can buy a copy of the book here:`
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
              default_action: {
                type: 'web_url',
                url:
                  'https://www.amazon.com/Shoe-Dog-Memoir-Creator-Nike/dp/1501135929',
                webview_height_ratio: 'FULL'
              },
              buttons: [
                {
                  type: 'web_url',
                  url:
                    'https://www.amazon.com/Shoe-Dog-Memoir-Creator-Nike/dp/1501135929',
                  title: 'Buy on Amazon'
                }
              ]
            }
          ]
        }
      }
    }
  ];
};
