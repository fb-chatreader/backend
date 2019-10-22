exports.up = function(knex) {
  return knex.schema.alterTable('users', tbl =>
    tbl.boolean('prefersLongSummaries').defaultsTo(null)
  );
};

exports.down = function(knex) {
  return knex.schema.alterTable('users', tbl =>
    tbl.dropColumn('prefersLongSummaries')
  );
};
