const Books = require('models/db/books.js');
const getUserInfo = require('../helpers/getUserInfo.js');
const UserCategories = require('models/db/userCategories.js');
const UserLibraries = require('models/db/userLibraries.js');

module.exports = async (event) => {
  const { bookCount } = event;

  if (!bookCount) {
    return [
      {
        text: 'Sorry, this bot is still being created, please visit us again soon!'
      }
    ];
  }
  return bookCount > 1 ? getMultipleBooks(event) : getSingleBook(event);
};

async function getMultipleBooks(event) {
  // For now, the bot assumes if there are multiple books, it's on ChatReader
  const { user_id } = event;
  const userCategories = await UserCategories.retrieve({ user_id });
  const userLibraries = await UserLibraries.retrieve({ user_id });

  const facebookID = event.user.facebook_id;
  const accessToken = event.page.access_token;
  const facebookUser = await getUserInfo(facebookID, accessToken);
  const FIRST_NAME = facebookUser.first_name;

  const introText = `Chatwise summarizes 2000+ popular non-fiction books into chat messages with key insights. Each book is summarized into a 10-15 minute read.`;
  const firstTimeText = `Hi ${FIRST_NAME}, welcome to Chatwise!\n\nWe summarize 2000+ popular non-fiction books into chat messages with key insights. Each book is summarized into a 10-15 minute read.`;

  const text = userCategories.length === 0 ? firstTimeText : introText;

  const buttons = [
    {
      type: 'postback',
      title: 'Browse Books',
      payload: JSON.stringify({
        command: 'browse'
      })
    }
  ];

  if (userLibraries.length) {
    buttons.push({
      type: 'postback',
      title: 'View Library',
      payload: JSON.stringify({ command: 'library' })
    });
  }

  buttons.push({
    type: 'postback',
    title: 'Get Help',
    payload: JSON.stringify({ command: 'help' })
  });

  return [
    {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text,
          buttons
        }
      }
    }
  ];
}

async function getSingleBook(event) {
  const book = await Books.retrieve({ page_id: event.page.id }).first();
  const userInfo = await getUserInfo(event.sender, event.page.access_token);

  const { id: book_id, title, author, synopsis, intro, image_url } = book;

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
