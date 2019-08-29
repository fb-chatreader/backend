exports.up = function(knex) {
  return knex.schema.createTable('users', tbl => {
    tbl.increments();
    tbl.text('facebook_id');
    tbl.text('email');
    tbl
      .foreign('users_categories_id')
      .references('categories_id')
      .inTable('user_categories');
    tbl
      .foreign('library')
      .references('users-libraryId')
      .inTable('userLibrary');

    tbl.timestamp('created_at', { useTz: true });
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
