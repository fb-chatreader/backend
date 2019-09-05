const db = require('../dbConfig.js');

module.exports = {
  retrieve,
  add
};

function retrieve(filter) {
  return filter ? db('book_categories').where(filter) : db('book_categories');
}

function add(category) {
  return db('book_categories')
    .insert(category, ['*'])
    .then(c => retrieve({ id: c[0].id }).first());
}
function edit(id, category) {
  return db('book_categories')
    .where({ id })
    .update(category);
}
