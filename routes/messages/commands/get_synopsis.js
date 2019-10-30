module.exports = async function(Event) {
  const { book_id } = Event;
  const [Books] = this.withDBs('books');
  console.log('SYNOPSIS BOOK ID: ', book_id);
  const book = await Books.retrieve({ 'b.id': book_id }).first();
  return this.sendTemplate('QuickReply', book.synopsis, [
    {
      title: 'Continue to Summary',
      payload: JSON.stringify({
        command: 'get_summary',
        book_id
      })
    }
  ]);
};
