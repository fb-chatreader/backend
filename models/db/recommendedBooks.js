const db = require('../index.js');

module.exports = {
  retrieve,
  add,
  edit,
  remove
};

function retrieve(filter) {
  return filter
    ? db('recommended_books').where(filter)
    : db('recommended_books');
}

function add(newData) {
  return db(`recommended_books`)
    .insert(newData, ['*'])
    .then(nd => retrieve({ id: nd[0].id }).first());
}

function edit(filter, changes) {
  return db(`recommended_books`)
    .where(filter)
    .update(changes, ['*'])
    .then(c => retrieve({ id: c[0].id }).first());
}

function remove(id) {
  return db('recommended_books')
    .where({ id })
    .del();
}
