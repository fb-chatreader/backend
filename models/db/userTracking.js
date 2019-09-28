const db = require('../index.js');

module.exports = { retrieve, add, edit };

function retrieve(filter) {
  return filter ? db('user_tracking').where(filter) : db('user_tracking');
}

function add(userBook) {
  return db(`user_tracking`)
    .insert(userBook, ['*'])
    .then(u => retrieve({ id: u[0].id }).first());
}

function edit(filter, changes) {
  return db('user_tracking')
    .where(filter)
    .update(changes, ['*'])
    .then(u => retrieve({ id: u[0].id }).first());
}
