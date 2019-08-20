const db = require('../dbConfig.js');

module.exports = {
  retrieve,
  retrieveByID,
  write,
  edit,
  remove,
  retrieveOrCreate
};

function retrieve(filter) {
  if (filter) {
    return db('users').where(filter);
  }
  return db('users');
}

function retrieveByID(id) {
  return db('users').where({ id });
}

function write(user) {
  return db(`users`)
    .insert(user, ['*'])
    .then(u => retrieve({ id: u[0].id }).first());
}

function edit(id, user) {
  return db('users')
    .where({ id })
    .update(user);
}

function remove(id) {
  return db('users')
    .where({ id })
    .del();
}

async function retrieveOrCreate(query) {
  const user = await retrieve(query).first();
  if (!user) {
    const { id, ...noID } = query;
    noID.created_at = new Date();
    return write(noID);
  }
  return user;
}
