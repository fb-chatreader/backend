exports.up = function(knex) {
  return knex.schema
    .createTable('user_tracking', tbl => {
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
        .integer('last_summary_id')
        .references('id')
        .inTable('summary_parts')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      tbl
        .integer('repeat_count')
        .notNullable()
        .defaultTo(0);
      tbl
        .timestamp('created_at')
        .notNullable()
        .defaultTo(knex.fn.now());
    })
    .alterTable('books', tbl => {
      tbl
        .integer('read_count')
        .notNullable()
        .defaultTo(0);
    });
};

exports.down = function(knex) {
  return knex.schema
    .alterTable('books', tbl => {
      tbl.dropColumn('read_count');
    })
    .dropTable('user_tracking');
};
