const db = require('../dbConfig.js');

module.exports = {
  retrieve,
  write
};

function retrieve(filter) {
  return filter ? db('book_categories').where(filter) : db('book_categories');
}

function write(category) {
  return db('book_categories')
    .insert(category, ['*'])
    .then(c => retrieve({ id: c[0].id }).first());
}
