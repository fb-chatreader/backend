const db = require('../index.js');

module.exports = {
  retrieve,
  add,
  edit,
  remove
};

function retrieve(filter) {
  return filter ? db('user_feedback').where(filter) : db('user_feedback');
}

function add(newData) {
  return db(`user_feedback`).insert(newData, [ '*' ]).then((nd) => retrieve({ id: nd[0].id }).first());
}

function edit(filter, changes) {
  return db(`user_feedback`).where(filter).update(changes, [ '*' ]).then((c) => retrieve({ id: c[0].id }).first());
}

function remove(id) {
  return db('user_feedback').where({ id }).del();
}
