exports.seed = function(knex) {
  return knex('chat_reads').insert([
    {
      user_id: 1,
      book_id: 1,
      current_summary_id: 1
    }
  ]);
};
