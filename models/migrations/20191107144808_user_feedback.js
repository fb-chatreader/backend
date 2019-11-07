exports.up = function(knex) {
  return knex.schema.createTable('user_feedback', (tbl) => {
    tbl.bigInteger('id').unique().notNullable();
    tbl.integer('user_id').references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE').notNullable();
    tbl.integer('feedback_score').notNullable().defaultTo(0);
    tbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('user_feedback');
};
