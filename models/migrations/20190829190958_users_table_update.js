exports.up = function(knex) {
    return knex.schema.alterTable('users', tbl => {
      tbl.text('email');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.alterTable('users', tbl => {
      tbl.dropColumn('email');
    });
  };