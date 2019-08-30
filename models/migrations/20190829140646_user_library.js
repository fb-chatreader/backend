exports.up = function(knex) {
  return knex.schema.alterTable('books', tbl => {
    tbl.increments();
    tbl
      .int('users_to_library')
      .reference('user_id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
      .notNullable();
    tbl
      .int('library_to_books')
      .reference('books_id')
      .inTable('books')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
      .notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('books', tbl => {
    tbl.dropColumn('users_to_library');
    tbl.dropColumn('library_to_books');
  });
};
