exports.up = function(knex) {
  return knex.schema
    .createTable('clients', tbl => {
      // Note: bigIntegers are returned as strings
      tbl
        .bigInteger('id')
        .unique()
        .notNullable();
      tbl.text('name').notNullable();
      tbl
        .text('access_token')
        .notNullable()
        .unique();
      tbl.text('verification_token').notNullable();
      tbl
        .timestamp('created_at')
        .notNullable()
        .defaultTo(knex.fn.now());
    })
    .createTable('users', tbl => {
      tbl.increments();
      tbl.text('facebook_id');
      tbl.text('email');
      tbl
        .timestamp('created_at')
        .notNullable()
        .defaultTo(knex.fn.now());
    })
    .createTable('books', tbl => {
      tbl.increments();
      tbl
        .text('title')
        .notNullable()
        .unique();
      tbl
        .integer('client_id')
        .references('id')
        .inTable('clients')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable();
      tbl.text('author').notNullable();
      tbl.text('synopsis');
      tbl.text('intro');
      tbl.text('image_url').notNullable();
      tbl
        .timestamp('created_at')
        .notNullable()
        .defaultTo(knex.fn.now());
    })
    .createTable('summary_parts', tbl => {
      tbl.increments();
      tbl
        .integer('book_id')
        .references('id')
        .inTable('books')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
        .notNullable();
      tbl.text('summary').notNullable();
      tbl
        .timestamp('created_at')
        .notNullable()
        .defaultTo(knex.fn.now());
    })
    .createTable('chat_reads', tbl => {
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
        .integer('current_summary_id')
        .references('id')
        .inTable('summary_parts')
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
    .dropTable('chat_reads')
    .dropTable('summary_parts')
    .dropTable('books')
    .dropTable('users')
    .dropTable('clients');
};
