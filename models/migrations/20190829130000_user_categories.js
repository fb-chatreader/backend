exports.up = function(knex) {
  return knex.schema.createTable('users_categories', tbl => {
    tbl.increments();
    tbl
      .foreign('to_categories')
      .references('categories_id')
      .inTable('categories');
    tbl
      .foreign('to_users')
      .references('users_id')
      .inTable('users');
    tbl.timestamp('created_at', { useTz: true });
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users_categories');
};
