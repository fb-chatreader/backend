
exports.up = function(knex) {
    return knex.schema.createTable('categories', tbl => {

    })
};

exports.down = function(knex) {
  return knex.schema.dropTable('categories')
};
