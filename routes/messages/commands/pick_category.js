const Users = require('models/db/users.js');
const Books = require('models/db/books.js');
const BookCategories = require('models/db/bookCategories.js');
const UserCategories = require('models/db/userCategories.js');

// const { getNewCategoriesForUser } = require('../helpers/categories.js');

module.exports = async event => {
  await event;

  if (
    event.type !== 'postback' &&
    event.command !== 'get_started' &&
    event.command !== 'save_email'
  )
    return;
  const { user_id, category_id } = event;

  const userCategoryObjects = await UserCategories.retrieve({ user_id });
  const userCategoryIDs = userCategoryObjects.map(c => c.category_id);

  const newCategory =
    category_id && userCategoryIDs.indexOf(category_id) === -1
      ? await UserCategories.add({ user_id, category_id })
      : null;

  if (newCategory) {
    userCategoryIDs.push(newCategory.category_id);
  }

  if (!userCategoryIDs.length) return;

  if (userCategoryIDs.length >= 3)
    return event.user.email
      ? finishCategories(userCategoryIDs, event)
      : getEmail(event);
};

async function getEmail(event) {
  const textResponses = {
    pick_category:
      "Great, I have what I need to make some suggestions!  Though first, I'd like to make an account for you so I can remember your preferences across platforms.  What email address can I attach to your account?",
    get_started:
      'I have some suggestions ready to go for you, just respond with a valid email and I can get them right to you!',
    default:
      "We use an email address to identify you across platforms.  Type a valid email address at any time and I'll save it to your account so you can proceed!"
  };

  const text = textResponses[event.command]
    ? textResponses[event.command]
    : textResponses.default;

  return [
    {
      text
    }
  ];
}

async function finishCategories(userCategoryIDs, event) {
  const {
    page: { id: page_id }
  } = event;

  const text = 'Based on your preferences, here are some books you might like!';

  const allBooks = await userCategoryIDs.reduce((accumulator, category_id) => {
    return accumulator.then(async books => {
      const categoryBooks = await BookCategories.retrieve({
        'bc.category_id': category_id,
        page_id
      });
      return [...books, ...categoryBooks];
    });
  }, Promise.resolve([]));

  const carousel = allBooks.length
    ? {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: allBooks.slice(0, 10).map(b => {
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
                title: 'Save to Library',
                payload: JSON.stringify({
                  command: 'save_to_library',
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
          }
        }
      }
    : null;

  return [{ text }, carousel];
}
