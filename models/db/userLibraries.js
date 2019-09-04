const db = require('../dbConfig.js');

module.exports = {
  retrieve,
  add,
  remove
};

function retrieve(filter) {
  return filter ? db('user_libraries').where(filter) : db('user_libraries');
}

function add(category) {
  return db(`user_libraries`)
    .insert(category, ['*'])
    .then(u => retrieve({ id: u[0].id }).first());
}

function remove(id) {
  return db('user_libraries')
    .where({ id })
    .del();
}
