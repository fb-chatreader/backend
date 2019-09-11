const Users = require('models/db/users.js');
const Books = require('models/db/books.js');
const pickCategory = require('./pick_category.js');
module.exports = async event => {
  // Currently just saves an email when presented with one.
  // Future work:
  // Return a series (3) of carousels based on the user's preferred categories, if they exist.
  const { user_id: id } = event;
  await Users.edit({ id }, { email: event.original_message });
  const books = Books.retrieve({ page_id: event.page.id });
  return books.length > 1 ? pickCategory(event) : null;
};
