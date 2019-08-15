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
    return db('summary_parts').where(filter);
  }
  return db('summary_parts');
}

function retrieveByID(summaryid) {
  return db('summary_parts').where({ id: summaryid });
}

function write(summary) {
  return db(`summary_parts`)
    .where({ summary })
    .then(ids => ({ id: ids[0] }));
}

function edit(summaryid, summary) {
  return db('summary_parts')
    .where({ id: summaryid })
    .update(summary);
}

function remove(summaryid) {
  return db('users')
    .where({ id: summaryid })
    .del();
}
