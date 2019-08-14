const knex = require('knex');
const knexConfig = require('../knexfile');
const db = knex(knexConfig.development);

module.exports = {
  retrieve,
  retrieveByID,
  write,
  edit,
  remove
};

function retrieve() {
  return db('users')
};

function retrieveByID(userid) {
  return db('users')
    .where({id : userid })
};

function write(user) {
  return db(`users`)
    .where({user})
    .then(ids => ({id : ids[0]}));
};

function edit(userid, user) {
    return db('users')
    .where({ id : userid })
    .update(user)
};

function remove(userid) {
    return db('users')
      .where({id : userid})
      .del();
};