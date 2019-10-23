exports.up = function(knex) {
  return knex.schema
    .alterTable('users', tbl =>
      tbl.boolean('prefersLongSummaries').defaultsTo(null)
    )
    .alterTable('books', tbl => tbl.text('shortSummary'));
};

exports.down = function(knex) {
  return knex.schema
    .alterTable('books', tbl => tbl.dropColumn('shortSummary'))
    .alterTable('users', tbl => tbl.dropColumn('prefersLongSummaries'));
};
