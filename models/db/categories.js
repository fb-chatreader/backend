const db = require('../dbConfig.js');

module.exports = {
  retrieve,
  write
};

function retrieve(filter) {
  if (filter) {
    return db('categories').where(filter);
  }
  return db('categories');
}

function write(category) {
  return db('categories')
    .insert(category, ['*'])
    .then(cat => retrieve({ id: cat[0].id }).first());
}
