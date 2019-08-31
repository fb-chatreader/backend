exports.seed = function(knex, Promise) {
  // delete all existing entries
  return knex('users')
    .del()
    .then(function() {
      return knex('users').insert([
        {
          facebook_id: 10152368852405295,
          created_at: new Date()
        }
      ]);
    });
};
