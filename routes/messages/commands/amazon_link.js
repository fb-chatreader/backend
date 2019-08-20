const Command = require('../classes/Command.js');
const Books = require('../../../models/db/books.js');

module.exports = async event => {
  const id = 1; //need a dynamic way to pull ids
  const book = await Books.retrieve({ id }).first();
  return {
    attachments: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: [
          {
            title: book.title,
            image_url: book.image_url,
            subtitle: 'Purchase on Amazon',
            default_action: {
              type: 'web_url',
              url: 'https://www.amazon.com/Shoe-Dog-Phil-Knight/dp/1508211809',
              messenger_extensions: FALSE,
              webview_height_ration: 'FULL'
            },
            buttons: [
              {
                type: 'web_url',
                url:
                  'https://www.amazon.com/Shoe-Dog-Phil-Knight/dp/1508211809',
                title: 'Buy on Amazon'
              }
            ]
          }
        ]
      }
    }
  };
};
