exports.up = function(knex) {
  return knex.schema.table('books', tbl => {
    tbl.dropColumn('user_id');
    // tbl.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.table('books', tbl => {
    tbl.dropColumn('created_at');
    // tbl.timestamps('created_at');
  });
};
