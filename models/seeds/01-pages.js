// require('dotenv').config();

exports.seed = function(knex) {
  // delete all existing entries
  return knex('pages').insert([
    {
      id: process.env.PAGE_ID,
      access_token: process.env.PAGE_ACCESS_TOKEN,
      verification_token: process.env.VERIFICATION_TOKEN
    }
  ]);
};
