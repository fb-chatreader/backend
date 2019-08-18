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

function retrieveByID(userid) {
  return db('users').where({ id: userid });
}

function write(user) {
  console.log('INSERTING: ', user);
  return db(`users`)
    .insert(user, ['*'])
    .then(u => retrieve({ id: u[0].id }).first());
}

function edit(userid, user) {
  return db('users')
    .where({ id: userid })
    .update(user);
}

function remove(userid) {
  return db('users')
    .where({ id: userid })
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
