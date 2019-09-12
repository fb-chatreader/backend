const UserLibrary = require('models/db/userLibraries.js');

module.exports = async event => {
  const { user_id, book_id, isAdding } = event;
  if (!book_id) {
    console.error('No book ID supplied, returning without a response');
    return;
  } else if (!user_id) {
    console.error('No user ID found, returning without a response');
    return;
  }

  const currentLibrary = await UserLibrary.retrieve({ 'ul.user_id': user_id });
  const exists = currentLibrary.find(b => b.id === book_id);

  // Two conditions something will happen:
  // 1) It's a new item and the user is trying to add it
  // 2) The user previous saved it and they want to remove it
  // Otherwise, don't do anything (ie: if they've already saved it and they're trying to add it)
  const method =
    !exists && isAdding ? 'add' : exists && !isAdding ? 'remove' : null;

  if (method) {
    await UserLibrary[method]({ user_id, book_id });
  }

  return null;
};
