const db = require('../index.js');

module.exports = {
  retrieve,
  add,
  edit,
  remove,
  editOrCreate
};

function retrieve(filter) {
  return filter ? db('chat_reads').where(filter) : db('chat_reads');
}

function add(chatRead) {
  return db(`chat_reads`)
    .insert(chatRead, ['*'])
    .then(cr => retrieve({ id: cr[0].id }).first());
}

function edit(filter, summary) {
  return db(`chat_reads`)
    .where(filter)
    .update(summary, ['*'])
    .then(cr => retrieve({ id: cr[0].id }).first());
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
    return add({ ...noID, ...summary_id });
  }
}
