exports.up = function(knex) {
  return knex.schema
    .createTable('recommended_books', tbl => {
        tbl.increments();
        tbl
            .integer('user_id')
            .references('id')
            .inTable('users')
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
        tbl
            .integer('current_sorted_book_index')
            .defaultTo(0);
        tbl
            .timestamp('created_at')
            .notNullable()
            .defaultTo(knex.fn.now());
    })
};

exports.down = function(knex) {
    return knex.schema
        .dropTable('recommended_books');
};
