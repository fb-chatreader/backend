const Books = require('../../../models/db/books.js');
const Users = require('../../../models/db/users.js');

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
  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: [
          {
            title: book.title,
            image_url: book.cover_img,
            subtitle: 'Purchase on Amazon!',
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
  };
};