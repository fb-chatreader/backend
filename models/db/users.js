const db = require('../dbConfig.js');

module.exports = {
  retrieve,
  retrieveByID,
  write,
  edit,
  remove
};

function retrieve(filter) {
  if (filter) {
    return db('users').where(filter);
  }
  return db('users');
}

function retrieveByID(userid) {
  return db('users').where({ id: userid });
}

function write(user) {
  return db(`users`)
    .where({ user })
    .then(ids => ({ id: ids[0] }));
}

function edit(userid, user) {
  return db('users')
    .where({ id: userid })
    .update(user);
}

function remove(userid) {
  return db('users')
    .where({ id: userid })
    .del();
}
