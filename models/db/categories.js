const db = require('../dbConfig.js');

module.exports = {
  retrieve,
  add
};

function retrieve(filter) {
  return filter ? db('categories').where(filter) : db('categories');
}

function add(category) {
  return db('categories')
    .insert(category, ['*'])
    .then(c => retrieve({ id: c[0].id }).first());
}
