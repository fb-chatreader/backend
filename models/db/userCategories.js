const db = require('../index.js');

module.exports = {
  retrieve,
  add,
  remove
};

function retrieve(filter) {
  return filter
    ? db('user_categories as uc')
        .select('c.id as category_id', 'c.name as name')
        .where(filter)
        .join('categories as c', { 'c.id': 'uc.category_id' })
    : db('user_categories as uc')
        .select('c.id as id', 'c.name as name')
        .join('categories as c', { 'c.id': 'uc.category_id' });
}

function add(category) {
  return db(`user_categories`).insert(category, [ '*' ]).then((u) => retrieve({ 'uc.id': u[0].id }).first());
}

function remove(filter) {
  return db('user_categories').where(filter).del();
}
