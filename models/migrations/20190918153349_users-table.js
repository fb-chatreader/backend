
exports.up = function(knex) {
    return knex.schema
    .createTable('users', tbl => {
        tbl
            .increments();
        tbl
            .text('uid')
            .notNullable()
            .unique();
        tbl
            .text('email')
            .notNullable();
        tbl
            .text('subscription_id')
            .notNullable()
            .unique();
        tbl
            .text('subscription_status')
            .notNullable();
    })
};

exports.down = function(knex) {
    return knex.schema
        .dropTable('users')
};
