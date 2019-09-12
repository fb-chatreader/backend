const Books = require('models/db/books.js');
const getUserInfo = require('../helpers/getUserInfo.js');
const UserCategories = require('models/db/userCategories.js');
const { getNewCategoriesForUser } = require('../helpers/categories.js');

const pickCategory = require('./pick_category.js');

module.exports = async event => {
  const books = await Books.retrieve({ page_id: event.page.id });

  if (!books.length) {
    return [
      {
        text:
          'Sorry, this bot is still being created, please visit us again soon!'
      }
    ];
  }
  return books.length > 1
    ? getMultipleBooks(event)
    : getSingleBook(event, books);
};

async function getMultipleBooks(event) {
  // For now, the bot assumes if there are multiple books, it's on ChatReader
  const { user_id } = event;
  const userCategories = await UserCategories.retrieve({ user_id });

  if (userCategories.length >= 3) {
    return pickCategory(event);
  }
  const response =
    userCategories.length === 0
      ? [
          {
            text:
              'Hi, welcome to Chat Reader!  I can read book summaries to you to help you learn more about them before you buy!'
          }
        ]
      : [];

  const newCategories = await getNewCategoriesForUser(event.user_id);
  const choicesLeft = 3 - userCategories.length;
  let text = `Of the genres below, click your ${
    choicesLeft === 1 ? 'top' : choicesLeft
  } favorite${choicesLeft > 1 ? 's' : ''}!`;

  if (!userCategories.length) {
    text = "Let's get started! " + text;
  }

  response.push({
    attachment: {
      type: 'template',
      payload: {
        template_type: 'button',
        text,
        buttons: newCategories.map(c => {
          // Everything except the category name must be destructured
          // for this to work
          const { name: title, id: category_id } = c;

          return {
            type: 'postback',
            title: title[0].toUpperCase() + title.substring(1),
            payload: JSON.stringify({
              command: 'pick_category',
              category_id
            })
          };
        })
      }
    }
  });

  return response;
}

async function getSingleBook(event, promise) {
  const books = await promise;
  const userInfo = await getUserInfo(event.sender, event.page.access_token);

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
    title: 'Start Summary',
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
