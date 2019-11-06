const db = require('../index.js');

module.exports = {
  retrieve,
  add,
  remove
};

function retrieve(filter) {
  return filter
    ? db('user_libraries as ul')
        .select(
          'b.id as id',
          'b.page_id as page_id',
          'b.title as title',
          'b.author as author',
          'b.intro as intro',
          'b.synopsis as synopsis',
          'b.image_url as image_url',
        )
        .where(filter)
        .join('books as b', { 'b.id': 'ul.book_id' })
    : db('user_libraries as ul')
        .select(
          'b.id as id',
          'b.page_id as page_id',
          'b.title as title',
          'b.author as author',
          'b.intro as intro',
          'b.synopsis as synopsis',
          'b.image_url as image_url'
        )
        .join('books as b', { 'b.id': 'ul.book_id' });
}

function add(addBook) {
  return db(`user_libraries`)
    .insert(addBook, ['*'])
    .then(u => retrieve({ 'b.id': u[0].id }).first());
}

function remove(filter) {
  return db('user_libraries')
    .where(filter)
    .del();
}
