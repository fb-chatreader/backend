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
  const { access_token, page_id: id } = page;
  // Because of the unique constraint, we always have to generate a new
  // verification_token, even when it isn't used
  return db(`pages`)
    .insert(
      {
        id,
        access_token,
        verification_token: bcrypt.hashSync(
          `${id}${new Date()}${process.env.APP_SECRET}`,
          10
        )
      },
      ['*']
    )
    .then(c => retrieve({ id: c[0].id }).first());
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
