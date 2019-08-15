const db = require('../dbConfig.js');

module.exports = {
  retrieve,
  retrieveByID,
  write,
  edit,
  remove
};

function retrieve() {
  return db('chat_reads');
}

function retrieveByID(chatReadid) {
  return db('chat_reads').where({ id: chatReadid });
}

function write(chatSummary) {
  return db(`chat_reads`)
    .where({ chatSummary })
    .then(ids => ({ id: ids[0] }));
}

function edit(chatReadid, chatSummary) {
  return db('chat_summary')
    .where({ id: chatReadid })
    .update(chatSummary);
}

function remove(chatReadid) {
  return db('chat_summary')
    .where({ id: chatReadid })
    .del();
}
