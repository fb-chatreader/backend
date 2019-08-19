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
      tbl.timestamp('send_at').notNullable();
    })
    .alterTable('books', tbl => {
      tbl.text('intro');
    });
};

exports.down = function(knex) {
  return knex.schema
    .alterTable('books', tbl => {
      tbl.dropColumn('intro');
    })
    .dropTable('timed_messages');
};
