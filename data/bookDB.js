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
  return db('books')
};

function retrieveByID(bkid) {
  return db('books')
    .where({id : bkid })
};

function write(book) {
  return db(`books`)
    .where({book})
    .then(ids => ({id : ids[0]}));
};

function edit(bkid, book) {
    return db('books')
    .where({ id : bkid })
    .update(book)
};

function remove(bkid) {
    return db('books')
      .where({id : bkid})
      .del();
};