// require('dotenv').config();

exports.seed = function(knex) {
  // delete all existing entries
  return knex('clients').insert([
    {
      id: 123456789,
      name: 'Todd James',
      access_token: process.env.PAGE_ACCESS_TOKEN,
      verification_token: process.env.VERIFICATION_TOKEN
    }
  ]);
};
