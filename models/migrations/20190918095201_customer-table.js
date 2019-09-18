
exports.up = function(knex) {
  return knex.schema
    .createTable('customers', table => {
        table
            .increments('id')
            .primary();
        table
            .text('stripe_customer_id')
            .notNullable()
            .unique();
        table
            .text('stripe_subscription_id')
            .notNullable()
            .unique();
    })
};

exports.down = function(knex) {
    return knex.schema
        .dropTable('customers');
};
