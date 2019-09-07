const db = require('../index.js');

module.exports = {
  retrieve,
  add,
  edit,
  remove
};

function retrieve(filter) {
  return filter ? db('users').where(filter) : db('users');
}

function add(user) {
  return db(`users`)
    .insert(user, ['*'])
    .then(u => retrieve({ id: u[0].id }).first());
}

function edit(filter, changes) {
  return db('users')
    .where(filter)
    .update(changes, ['*'])
    .then(u => retrieve({ id: u[0].id }).first());
}

function remove(id) {
  return db('users')
    .where({ id })
    .del();
}
