const db = require('../index.js');

module.exports = {
  retrieve,
  add,
  edit,
  remove
};

function retrieve(filter) {
  return filter ? db('timed_messages').where(filter) : db('timed_messages');
}

function add(timedMessage) {
  // Hard coding send_at values to 24 hours to ensure policy adherence
  timedMessage.send_at = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

  return db('timed_messages')
    .insert(timedMessage, ['*'])
    .then(tm => retrieve({ id: tm[0].id }).first());
}

function edit(filter, timedMessage) {
  return db('timed_messages')
    .where(filter)
    .update(timedMessage, ['*'])
    .then(tm => retrieve({ id: tm[0].id }).first());
}

function remove(id) {
  return db('timed_messages')
    .where({ id })
    .del();
}
