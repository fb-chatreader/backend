const db = require('../index.js');
const bcrypt = require('bcrypt');

module.exports = {
  retrieve,
  add,
  edit,
  remove,
  newVerificationToken
};

function retrieve(filter) {
  return filter ? db('pages').where(filter) : db('pages');
}

function add(page) {
  const { access_token, name } = page;
  return getID(name)
    .then(id =>
      db(`pages`)
        .insert(
          {
            id,
            access_token,
            name,
            verification_token: bcrypt.hashSync(
              `${name}${new Date()}${process.env.APP_SECRET}`,
              10
            )
          },
          ['*']
        )
        .then(c => retrieve({ id: c[0].id }).first())
    )
    .catch(err => console.log('Something went wrong adding the page: ', err));
}

function edit(filter, changes) {
  return db('pages')
    .where(filter)
    .update(changes)
    .then(c => retrieve({ id: c[0].id }).first());
}

function remove(id) {
  return db('pages')
    .where({ id })
    .del();
}

async function getID(name) {
  const id = _hashCode(`${name} ${new Date()}`);
  const exists = await retrieve({ id }).first();
  if (!exists) {
    return id;
  }
  getID(name);
}

function newVerificationToken(id) {
  return db('pages')
    .where({ id })
    .update(
      {
        verification_token: bcrypt.hashSync(
          `${id}${new Date()}${process.env.APP_SECRET}`,
          10
        )
      },
      ['*']
    )
    .then(c => retrieve({ id: c.id }).first());
}

function _hashCode(str) {
  let hash = 0;
  if (str.length == 0) {
    return hash;
  }
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}
