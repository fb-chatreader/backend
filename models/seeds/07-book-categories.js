exports.seed = function(knex) {
  return knex('book_categories').insert({ book_id: 1, category_id: 2 });
};
