const db = require('../index.js');

module.exports = {
  retrieve,
  add,
  edit,
  remove
};

function retrieve(filter) {
  return filter
    ? db('books as b')
        .select(
          'b.id as id',
          'b.title as title',
          'b.author as author',
          'b.rating_qty as rating_qty',
          'b.avg_rating as avg_rating',
          'b.synopsis as synopsis',
          'b.intro as intro',
          'b.page_id as page_id',
          'b.created_at as created_at',
          'b.image_url as image_url',
          'c.name as category',
          'b.read_count as read_count'
        )
        .where(filter)
        .leftJoin('book_categories as bc', { 'bc.book_id': 'b.id' })
        .leftJoin('categories as c', { 'c.id': 'bc.category_id' })
    : db('books as b')
        .select(
          'b.id as id',
          'b.title as title',
          'b.author as author',
          'b.rating_qty as rating_qty',
          'b.avg_rating as avg_rating',
          'b.synopsis as synopsis',
          'b.intro as intro',
          'b.page_id as page_id',
          'b.created_at as created_at',
          'b.image_url as image_url',
          'c.name as category',
          'b.read_count as read_count'
        )
        .join('book_categories as bc', { 'bc.book_id': 'b.id' })
        .join('categories as c', { 'c.id': 'bc.category_id' });
}

function add(book) {
  return db(`books`)
    .insert(book, ['*'])
    .then(b => retrieve({ 'b.id': b[0].id }).first());
}

function edit(filter, changes) {
  return db('books')
    .where(filter)
    .update(changes, ['*'])
    .then(b => retrieve({ 'b.id': b[0].id }).first());
}

function remove(id) {
  return db('books')
    .where({ id })
    .del();
}
