exports.up = function(knex) {
    return knex.schema.alterTable('users', tbl => {
      tbl.text('email');
      tbl
        .foreign('users_categories_id')
        .references('categories_id')
        .inTable('user_categories')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
        .notNullable();
  
      tbl
        .foreign('users_to_library')
        .references('users_library_id')
        .inTable('users_library')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
        .notNullable();
    });
  };
  
