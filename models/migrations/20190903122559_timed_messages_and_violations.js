exports.up = function(knex) {
  return knex.schema
    .createTable('timed_messages', tbl => {
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
        .boolean('isComplete')
        .notNullable()
        .defaultTo(false);
      tbl.timestamp('send_at').notNullable();
      tbl
        .timestamp('created_at')
        .notNullable()
        .defaultTo(knex.fn.now());
    })
    .createTable('violations', tbl => {
      tbl.increments();
      tbl.text('page_id').notNullable();
      tbl.text('action').notNullable();
      tbl.text('reason').notNullable();
      tbl
        .timestamp('created_at')
        .notNullable()
        .defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
  return knex.schema.dropTable('violations').dropTable('timed_messages');
};
