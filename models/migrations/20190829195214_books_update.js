exports.up = function(knex) {
  return knex.schema.alterTable('books', tbl => {
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
  return knex.schema.alterTable('books', tbl => {
    tbl.dropColumn('books_to_categories');
  });
};
