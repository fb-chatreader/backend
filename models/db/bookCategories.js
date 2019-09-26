const db = require('../index.js');

module.exports = {
  retrieve,
  add
};

function retrieve(filter) {
  return filter
    ? db('book_categories as bc')
        .select(
          'b.id as id',
          'b.page_id as page_id',
          'b.title as title',
          'b.author as author',
          'b.intro as intro',
          'b.synopsis as synopsis',
          'b.image_url as image_url',
          'b.rating_qty as rating_qty',
          'b.avg_rating as avg_rating'
        )
        .join('books as b', { 'b.id': 'bc.book_id' })
        .where(filter)
    : db('book_categories as bc')
        .select(
          'bc.book_id as id',
          'b.page_id as page_id',
          'b.author as author',
          'b.intro as intro',
          'b.image_url as image_url'
        )
        .join('books as b', { 'b.id': 'bc.book_id' });
}

function add(category) {
  return db('book_categories').insert(category, [ '*' ]).then((c) => retrieve({ 'bc.id': c[0].id }).first());
}
