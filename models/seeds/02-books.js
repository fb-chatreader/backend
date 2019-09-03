// // 10 Books Ipsum Data

// const books = require('./ipsumBookData/');

// exports.seed = function(knex) {
//   // delete all entries
//   return knex('books')
//     .del()
//     .then(function() {
//       return knex('books').insert(
//         books.map(b => {
//           const { summary, ...rest } = b;
//           rest.created_at = new Date();
//           rest.publish_date = new Date(rest.publish_date);
//           return rest;
//         })
//       );
//     });
// };

// Static Shoe Dog Data:

exports.seed = function(knex) {
  // delete all entries
  return knex('books').insert({
    title: 'Shoe Dog',
    author: 'Phil Knight',
    synopsis:
      'Shoe Dog (2016) tells the story of the man behind the famous footwear company Nike. These blinks offer a peek into the mind of genius entrepreneur Phil Knight and detail the rollercoaster ride he went to through to build up his company.',
    image_url:
      'https://cdn1.imggmi.com/uploads/2019/8/23/80695b1acdb40ed02bb8d1a310dd9941-full.jpg',
    intro:
      "I'm Phil Knight and I'm the founding CEO of Nike, wanted to share with you a quick preview of my book Shoe Dog"
  });
};
