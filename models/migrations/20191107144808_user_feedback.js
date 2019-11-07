exports.up = function(knex) {
  return knex.schema.createTable('user_feedback', (tbl) => {
    tbl.increments();
    tbl.integer('feedback_score');
    tbl.text('additional_feedback');
    tbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('user_feedback');
};
