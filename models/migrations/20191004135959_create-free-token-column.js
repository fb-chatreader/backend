exports.up = function(knex) {
  return knex.schema.alterTable('users', (tbl) => {
    tbl.bigInteger('credits').notNullable().defaultTo(1);
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('users', (tbl) => {
    tbl.dropColumn('credits');
  });
};
