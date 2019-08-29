
exports.up = function(knex) {
  return knex.schema.createTable('users_library', tbl => {
      tbl.increments();
       
  })
};

exports.down = function(knex) {
  
};
