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

  const method =
    !exists && isAdding ? 'add' : exists && !isAdding ? 'remove' : null;

  if (method) {
    await UserLibrary[method]({ user_id, book_id });
  }

  return null;
};
