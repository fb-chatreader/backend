exports.up = function(knex) {
  return knex.schema
    .createTable('categories', tbl => {
      tbl.increments();
      tbl.text('leadership');
      tbl.text('entrepreneurship');
      tbl.text('money');
      tbl.text('other');
      tbl
        .timestamp('created_at')
        .notNullable()
        .defaultTo(knex.fn.now());
    })
    .createTable('users_categories', tbl => {
      tbl.increments();
      tbl
        .integer('category_id')
        .references('id')
        .inTable('categories')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
        .notNullable();
      tbl
        .integer('user_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
        .notNullable();
      tbl
        .timestamp('created_at')
        .notNullable()
        .defaultTo(knex.fn.now());
    })
    .createTable('book_categories', tbl => {
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
      tbl
        .timestamp('created_at')
        .notNullable()
        .defaultTo(knex.fn.now());
    })
    .createTable('user_libraries', tbl => {
      tbl.increments();
      tbl
        .integer('user_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
        .notNullable();
      tbl
        .integer('book_id')
        .references('id')
        .inTable('books')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
        .notNullable();
      tbl
        .timestamp('created_at')
        .notNullable()
        .defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('user_libraries')
    .dropTable('book_categories')
    .dropTable('users_categories')
    .dropTable('categories');
};
