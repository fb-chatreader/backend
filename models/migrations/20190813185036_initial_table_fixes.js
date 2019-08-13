exports.up = function(knex) {
  return knex.schema.table('books', tbl => {
    tbl.dropColumn('user_id');
  });
};

exports.down = function(knex) {
  return knex.schema.table('books', tbl => {
    tbl.dropColumn('created_at');
  });
};
