exports.up = function(knex) {
  return knex.schema.createTable('users_categories', tbl => {
    tbl.increments();
    tbl
      .integer('category_id')
      .references('id')
      .inTable('categories');
    tbl
      .integer('user_id')
      .references('id')
      .inTable('users');
    tbl.timestamp('created_at', { useTz: true });
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users_categories');
};
