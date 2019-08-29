exports.up = function(knex) {
    return knex.schema.alterTable('books', tbl => {
      tbl
        // .foreign('books_to_categories')
        .references('categories_id')
        .inTable('categories')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
        .notNullable();

  });
};

