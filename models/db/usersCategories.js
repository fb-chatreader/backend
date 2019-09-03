const db = require('../dbConfig.js');

module.exports = {
  retrieve,
  write,
  edit,
};

function retrieve(filter) {
  if (filter) {
    return db('usersCategories').where(filter);
  }
  return db('usersCategories');
}

function write(category) {
  return db('usersCategories')
    .insert(category, ['*'])
    .then(cat => retrieve({ id: cat[0].id }).first());
}
function edit(id, category) {
  return db('usersCategories')
    .where({ id })
    .update(category);
}