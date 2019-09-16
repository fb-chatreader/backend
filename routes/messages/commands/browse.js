const BookCategories = require('models/db/bookCategories.js');
const UserCategories = require('models/db/userCategories.js');
const UserLibraries = require('models/db/userLibraries.js');
const pick_category = require('./pick_category.js');
const request_email = require('./request_email.js');

module.exports = async event => {
  const {
    user_id,
    page: { id: page_id }
  } = event;

  const userCategories = await UserCategories.retrieve({ user_id });

  if (userCategories.length < 3) {
    const category = await pick_category(event);
    if (category !== 'Done') {
      return category;
    }
  }

  if (!event.user.email) {
    return request_email(event);
  }

  const text = 'Based on your preferences, here are some books you might like!';

  // Get all books matching user's preferences
  let allBooks = await userCategories.reduce((accumulator, c) => {
    return accumulator.then(async books => {
      const categoryBooks = await BookCategories.retrieve({
        'bc.category_id': c.category_id,
        page_id
      });
      return [...books, ...categoryBooks];
    });
  }, Promise.resolve([]));

  // Get books in the user's library
  const usersLibrary = await UserLibraries.retrieve({ user_id, page_id });

  // Do not suggest books the user has already saved
  allBooks = allBooks.filter(b => !usersLibrary.find(ul => ul.id === b.id));

  if (!allBooks.length) {
    // If they've saved all the books, just show them their library
    allBooks = usersLibrary;
  }

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
                  command: 'toggle_in_library',
                  book_id: b.id,
                  isAdding: true
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
};
