const db = require('../dbConfig.js');

module.exports = {
  retrieve,
  write
};

function retrieve(filter) {
  if (filter) {
    return db('book_categories').where(filter);
  }
  return db('book_categories');
}

function write(category) {
  return db('book_categories')
    .insert(category, ['*'])
    .then(cat => retrieve({ id: cat[0].id }).first());
}
