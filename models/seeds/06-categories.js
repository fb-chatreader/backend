exports.seed = function(knex) {
  return knex('categories').insert([
    { name: 'Leadership' },
    { name: 'Entrepreneurship' },
    { name: 'Money' }
  ]);
};
