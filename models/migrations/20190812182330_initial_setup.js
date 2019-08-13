exports.up = function(knex) {
  return knex.schema.createTable('users', tbl => {
    tbl.increments();
    tbl.text('facebook_id');
    tbl.timestamp('created_at', { useTz: true });
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
