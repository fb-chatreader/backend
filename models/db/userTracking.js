module.exports = { add, edit };

function add(userBook) {
  return db(`user_tracking`)
    .insert(userBook, ['*'])
    .then(b => retrieve({ id: b[0].id }).first());
}

function edit(filter, changes) {
  return db('user_tracking')
    .where(filter)
    .update(changes)
    .then(b => retrieve({ id: b[0].id }).first());
}
