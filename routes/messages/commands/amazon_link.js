const Books = require('../../../models/db/books.js');

module.exports = async event => {
  const id = 1; //need a dynamic way to pull ids
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
