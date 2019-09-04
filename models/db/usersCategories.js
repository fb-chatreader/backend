const db = require('../dbConfig.js');

module.exports = {
  retrieve,
  write,
  edit,
};

function retrieve(filter) {
  if (filter) {
    return db('users_categories').where(filter);
  }
  return db('users_categories');
}

function write(category) {
  return db('users_categories')
    .insert(category, ['*'])
    .then(cat => retrieve({ id: cat[0].id }).first());
}
function edit(id, category) {
  return db('users_categories')
    .where({ id })
    .update(category);
}