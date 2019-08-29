exports.up = function(knex) {
  return knex.schema.createTable('library', tbl => {
    tbl.increments();
    tbl
      .foreign('users_to_library')
      .reference('user_id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
      .notNullable();
    tbl
      .foreign('library_to_books')
      .reference('books_id')
      .inTable('books')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
      .notNullable();
  });
};

exports.down = function(knex) {
    return knex.schema.dropTable('library');
};
