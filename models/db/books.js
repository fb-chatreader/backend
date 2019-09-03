const db = require('../dbConfig.js');

module.exports = {
  retrieve,
  add,
  edit,
  remove
};

function retrieve(filter) {
  return filter ? db('books').where(filter) : db('books');
}

function add(book) {
  return db(`books`)
    .insert(book, ['*'])
    .then(b => retrieve({ id: b[0].id }).first());
}

function edit(filter, changes) {
  return db('books')
    .where(filter)
    .update(changes)
    .then(b => retrieve({ id: b[0].id }).first());
}

function remove(id) {
  return db('books')
    .where({ id })
    .del();
}
