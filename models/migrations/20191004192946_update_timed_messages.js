exports.up = function(knex) {
  return knex.schema.alterTable('timed_messages', (tbl) => {
    tbl.dropColumn('book_id');
    tbl.dropColumn('isComplete');
    tbl.bigInteger('page_id').references('id').inTable('pages').onUpdate('CASCADE').onDelete('CASCADE').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('timed_messages', (tbl) => {
    tbl.dropColumn('page_id');
    tbl.boolean('isComplete').notNullable().defaultTo(false);
    tbl.integer('book_id').references('id').inTable('books').onDelete('CASCADE').onUpdate('CASCADE').notNullable();
  });
};
