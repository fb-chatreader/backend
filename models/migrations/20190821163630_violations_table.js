exports.up = function(knex) {
  return knex.schema.createTable('violations', tbl => {
    tbl.increments();
    tbl.text('page_id').notNullable();
    tbl.text('action').notNullable();
    tbl.text('reason').notNullable();
    tbl.timestamp('created_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('violations');
};
