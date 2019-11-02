module.exports = async function(Event) {
  if (this.hasState(Event)) {
    // If an onboarding detour was taken, retrieve original state then clear it
    this.getState(Event);
    this.clearState(Event);
  }
  const { user_id, book_id, isAdding } = Event;

  const [Books, UserLibraries] = this.withDBs('books', 'userLibraries');

  const book = Books.retrieve({ 'b.id': book_id }).first();
  const currentLibrary = await UserLibraries.retrieve({
    'ul.user_id': user_id
  });
  const exists = currentLibrary.find(b => b.id === book_id);
  // Two conditions something will happen:
  // 1) It's a new item and the user is trying to add it
  // 2) The user previous saved it and they want to remove it
  // Otherwise, don't do anything (ie: if they've already saved it and they're trying to add it)
  const method =
    !exists && isAdding ? 'add' : exists && !isAdding ? 'remove' : null;

  if (method) {
    await UserLibraries[method]({ user_id, book_id });
    const firstWord = method === 'add' ? 'Saved' : 'Removed';
    const preposition = method === 'add' ? 'to' : 'from';
    return { text: `${firstWord} ${book.title} ${preposition} your library!` };
  }

  return { text: `That has already been ${isAdding ? 'saved' : 'removed'}` };
};
