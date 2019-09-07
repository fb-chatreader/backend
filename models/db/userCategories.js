const db = require('../index.js');

module.exports = {
  retrieve,
  add,
  remove
};

function retrieve(filter) {
  return filter ? db('user_categories').where(filter) : db('user_categories');
}

function add(category) {
  return db(`user_categories`)
    .insert(category, ['*'])
    .then(u => retrieve({ id: u[0].id }).first());
}

function remove(id) {
  return db('user_categories')
    .where({ id })
    .del();
}
