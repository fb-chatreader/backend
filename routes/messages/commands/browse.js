const BookCategories = require('models/db/bookCategories.js');
const UserCategories = require('models/db/userCategories.js');
const UserLibraries = require('models/db/userLibraries.js');
const pick_category = require('./pick_category.js');
const request_email = require('./request_email.js');

const BookTemplate = require('../UI/BookTemplate.js');

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
  if (!allBooks.length) {
    console.error('Made it to browse but there are no books to show!');
    return;
  }
  const carousel = await BookTemplate(event, allBooks);
  return [{ text }, carousel];
};
