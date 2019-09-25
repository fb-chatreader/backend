exports.up = function(knex) {
  return knex.schema.alterTable('books', (tbl) => {
    tbl
      .text('avg_rating')
      .references('id')
      .inTable('pages')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
      .notNullable()
      .defaultTo(process.env.PAGE_ID);
  });
};

exports.down = function(knex) {
  knex.schema.dropColumn('page_id');
};
