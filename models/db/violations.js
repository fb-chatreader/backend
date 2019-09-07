const db = require('../index.js');

module.exports = {
  retrieve,
  edit
};

function retrieve(filter) {
  return filter ? db('violations').where(filter) : db('violations');
}

function edit(violation) {
  return db('violations')
    .insert(violation, ['*'])
    .then(v => retrieve({ id: v[0].id }));
}
