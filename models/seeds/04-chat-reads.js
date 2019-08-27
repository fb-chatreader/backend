exports.seed = function(knex, Promise) {
  return knex('chat_reads')
    .del()
    .then(function() {
      return knex('chat_reads').insert([
        {
          user_id: 1,
          book_id: 1,
          current_summary_id: 1,
          created_at: new Date()
        }
      ]);
    });
};
