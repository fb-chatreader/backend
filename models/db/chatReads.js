const db = require('../dbConfig.js');

module.exports = {
  retrieve,
  retrieveByID,
  write,
  edit,
  remove,
  editOrCreate
};

function retrieve(filter) {
  if (filter) {
    return db('chat_reads').where(filter);
  }
  return db('chat_reads');
}

function retrieveByID(id) {
  return db('chat_reads')
    .where({ id })
    .first();
}

function write(chatRead) {
  return db(`chat_reads`)
    .insert(chatRead, ['*'])
    .then(cr => retrieve({ id: cr[0].id }).first());
}

function edit(filter, summary) {
  return db(`chat_reads`)
    .update(summary, ['*'])
    .where(filter);
}

function remove(id) {
  return db('chat_reads')
    .where({ id })
    .del();
}

async function editOrCreate(filter, summary_id) {
  const chatRead = await retrieve(filter).first();
  if (chatRead) {
    return edit(filter, summary_id);
  } else {
    const { id, ...noID } = filter;
    return write({ ...noID, ...summary_id, created_at: new Date() });
  }
}
