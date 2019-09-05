exports.seed = function(knex) {
  // delete all existing entries
  return knex('users').insert([
    {
      facebook_id: 10152368852405295
    }
  ]);
};
