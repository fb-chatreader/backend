exports.up = function(knex) {
  return knex.schema
    .createTable('books', tbl => {
      tbl.increments();
      tbl.text('title');
      tbl.text('author');
      tbl.text('synopsis');
      tbl.text('cover_img');
      tbl.date('publish_date');
      tbl.timestamps('created_at',true);
    })
    .createTable('summary_parts', tbl => {
      tbl.increments();
      tbl
        .integer('book_id')
        .references('id')
        .inTable('books')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
        .notNullable(); 
      tbl.text('summary');
      tbl.timestamps('created_at');
    })
    .createTable('chat_reads', tbl => {
      tbl.increments();
      tbl
        .integer('user_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
        .notNullable();
      tbl
        .integer('book_id')
        .references('id')
        .inTable('books')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
        .notNullable();
      tbl
        .integer('current_summary_id')
        .references('id')
        .inTable('summary_parts')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
        .notNullable();
      tbl.timestamps('created_at');
    });
};

exports.down = function(knex) {
  return knex.schema
  .dropTable('chat_reads')
  .dropTable('summary_parts')
  .dropTable('books');
};
