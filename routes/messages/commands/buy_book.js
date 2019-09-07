const Books = require('models/db/books.js');
const getUserInfo = require('../helpers/getUserInfo.js');

module.exports = async event => {
  const id = event.book_id;
  const book = await Books.retrieve({ id }).first();

  const user_info = await getUserInfo(event.sender, event.client.access_token);

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
              image_url: book.image_url,
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
