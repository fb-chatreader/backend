const UserLibrary = require('models/db/userLibraries.js');
const Books = require('models/db/books.js');
module.exports = async event => {
  const { user_id } = event;

  const userLibrary = await UserLibrary.retrieve({ user_id });

  return !userLibrary.length
    ? [
        {
          text: "You don't have a library yet!"
        }
      ]
    : [
        {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: await Promise.all(
                await userLibrary.slice(0, 10).map(async (lib, i) => {
                  const b = await Books.retrieve({
                    id: lib.book_id
                  }).first();
                  const buttons = [];
                  if (b.synopsis) {
                    buttons.push({
                      type: 'postback',
                      title: 'Read Synopsis',
                      payload: JSON.stringify({
                        command: 'get_synopsis',
                        book_id: b.id
                      })
                    });
                  }
                  buttons.push({
                    type: 'postback',
                    title: 'Start Summary',
                    payload: JSON.stringify({
                      command: 'get_summary',
                      book_id: b.id
                    })
                  });
                  buttons.push({
                    type: 'postback',
                    title: 'Buy on Amazon',
                    payload: JSON.stringify({
                      command: 'buy_book',
                      book_id: b.id
                    })
                  });

                  return {
                    title: b.title,
                    image_url: b.image_url,
                    subtitle: `by ${b.author}`,
                    buttons
                  };
                })
              )
            }
          }
        }
      ];
};
