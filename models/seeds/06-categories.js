exports.seed = function(knex) {
  return knex('categories').insert([
    { leadership: 1 },
    { entrepreneurship: 1 },
    { money: 1 },
    { other: 1 }
  ]);
};
