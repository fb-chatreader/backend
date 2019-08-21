const axios = require('axios');
const Books = require('../../../models/db/books.js');
const Users = require('../../../models/db/users.js');
const getUserInfo = require('../util/asycFunctions');

module.exports = async event => {
  const id = 1; //need a dynamic way to pull ids
  const book = await Books.retrieve({ id }).first();
  // const user = await Users.retrieveOrCreate({ facebook_id: event.sender.id });

  // await ChatReads.editOrCreate(
  //   { user_id: user.id, book_id },
  //   { current_summary_id: 1 }
  // );

  const user_info = await getUserInfo(event.sender.id);

  return [
    {
      text: `${user_info.first_name}, thank you for reading a quick summary of ${book.title}, I hope you liked it! You can buy a copy of the book here:`
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
  }];
};