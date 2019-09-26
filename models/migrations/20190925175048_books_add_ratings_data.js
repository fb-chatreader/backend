exports.up = function(knex) {
  return knex.schema.alterTable('books', (tbl) => {
    tbl.float('avg_rating').notNullable().defaultTo(0);
    tbl.float('rating_qty').notNullable().defaultTo(0);
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('books', (tbl) => {
    tbl.dropColumn('avg_rating');
    tbl.dropColumn('rating_qty');
  });
};
