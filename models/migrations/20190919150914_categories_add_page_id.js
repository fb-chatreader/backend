exports.up = function(knex) {
  return knex.schema.alterTable('categories', (tbl) => {
    tbl.increments();
    tbl.bigInteger('page_id').references('id').inTable('pages').onUpdate('CASCADE').onDelete('CASCADE').notNullable();
  });
};

exports.down = function(knex) {
  knex.schema.dropColumn('page_id');
};
