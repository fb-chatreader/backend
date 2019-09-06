const Books = require('models/db/books.js');
const Categories = require('models/db/categories.js');
const getUserInfo = require('../helpers/getUserInfo.js');

module.exports = async input => {
  const books = await Books.retrieve({ client_id: input.client_id });
  if (!books.length) {
    return {
      text:
        'Sorry, this bot is still being created, please visit us again soon!'
    };
  }
  return books.length > 1
    ? getMultipleBooks(input)
    : getSingleBook(input, books);
};

async function getMultipleBooks() {
  // For now, the bot assumes if there are multiple books, it's on ChatReader
  const text =
    "Hi, welcome to Chat Reader!  I can read a summary of a wide variety of books to you with just a few clicks!  To get started, why don't you tell me a little about some genres that you like to read.  First things first which is your favorite genre from the below list?";

  const allCategories = await Categories.retrieve();
  const validCategories = allCategories.filter(c => c.other !== 1);

  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'button',
        text,
        buttons: validCategories.map(c => {
          // Everything except the category name must be destructured
          // for this to work
          const { id, image_url, flavor_text, ...categories } = c;

          const title = Object.keys(categories).filter(
            name => categories[name]
          )[0];

          return {
            type: 'postback',
            title: title[0].toUpperCase() + title.substring(1),
            payload: JSON.stringify({
              command: 'pick_category',
              category_id: id
            })
          };
        })
      }
    }
  };
}

async function getSingleBook(input, booksPromise) {
  const books = await booksPromise;
  const userInfo = await getUserInfo(input.sender.id, input.access_token);

  const { id: book_id, title, author, synopsis, intro, image_url } = books[0];

  const text = `Hi, ${userInfo.first_name}! ${intro}`;

  const buttons = [];
  if (synopsis) {
    buttons.push({
      type: 'postback',
      title: 'Quick Synopsis',
      payload: JSON.stringify({
        command: 'get_synopsis',
        book_id
      })
    });
  }

  buttons.push({
    type: 'postback',
    title: 'Read Now',
    payload: JSON.stringify({
      command: 'get_summary',
      book_id
    })
  });

  return [
    { text },
    {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [
            {
              title,
              image_url,
              subtitle: `by ${author}`,
              buttons
            }
          ]
        }
      }
    }
  ];
}

/*

Working second response object for a carousel of categories:

{
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: allCategories
            .filter(c => c.other !== 1)
            .map(c => {
              // Everything except the category name must be destructured
              // for this to work
              const { id, image_url, flavor_text, ...categories } = c;

              const title = Object.keys(categories).filter(
                name => categories[name]
              )[0];
              return {
                title: title[0].toUpperCase() + title.substring(1),
                image_url: image_url,
                subtitle: flavor_text ? flavor_text : null,
                buttons: [
                  {
                    type: 'postback',
                    title,
                    payload: JSON.stringify({
                      command: 'save_favorite',
                      category_id: id
                    })
                  }
                ]
              };
            })
        }
      }
    }
    */
