exports.up = function(knex) {
  return knex.schema.createTable('book_categories', tbl => {
    tbl.increments();
    tbl
      .integer('book_id')
      .references('id')
      .inTable('books')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
      .notNullable();
    tbl
      .integer('category_id')
      .references('id')
      .inTable('categories')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
      .notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('book_categories');
};
