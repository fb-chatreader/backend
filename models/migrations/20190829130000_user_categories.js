exports.up = function(knex) {
  return knex.schema.createTable('users_categories', tbl => {
    tbl.increments();
    tbl
      .integer('to_categories')
      .references('id')
      .inTable('categories');
    tbl
      .integer('to_users')
      .references('id')
      .inTable('users');
    tbl.timestamp('created_at', { useTz: true });
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users_categories');
};
