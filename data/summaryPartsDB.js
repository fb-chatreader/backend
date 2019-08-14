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
  return db('summary_parts')
};

function retrieveByID(summaryid) {
  return db('summary_parts')
    .where({id : summaryid })
};

function write(summary) {
  return db(`summary_parts`)
    .where({summary})
    .then(ids => ({id : ids[0]}));
};

function edit(summaryid, summary) {
    return db('summary_parts')
    .where({ id : summaryid })
    .update(summary)
};

function remove(summaryid) {
    return db('users')
      .where({id : summaryid})
      .del();
};