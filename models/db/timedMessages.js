const db = require('../dbConfig.js');

module.exports = {
  retrieve,
  update,
  write,
  remove
};

function retrieve(filter) {
  if (filter) {
    return db('timed_messages').where(filter);
  }
  return db('timed_messages');
}

function write(timedMessage) {
  return db('timed_messages')
    .insert(timedMessage, ['*'])
    .then(tm => retrieve({ id: tm[0].id }).first());
}

function update(filter, timedMessage) {
  return db('timed_messages')
    .where(filter)
    .update(timedMessage, ['*']);
}

function remove(id) {
  return db('timed_messages')
    .where({ id })
    .del();
}
