exports.up = function(knex) {
  return knex.schema.createTable('user_libraries', tbl => {
    tbl.increments();
    tbl
      .integer('user_id')
      .references('id')
      .inTable('users')

    tbl
      .integer('book_id')
      .references('id')
      .inTable('books')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
      .notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('user_libraries');
};
