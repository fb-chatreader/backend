exports.seed = function(knex) {
  return knex('user_categories').insert({ user_id: 1, category_id: 1 });
};
