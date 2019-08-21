const db = require('../dbConfig.js');

module.exports = {
  write
};

function retrieve(filter) {
  if (filter) {
    return db('violations').where(filter);
  }
  return db('violations');
}

function write(violation) {
  return db('violations')
    .insert(violation, ['*'])
    .then(v => retrieve({ id: v[0].id }));
}
