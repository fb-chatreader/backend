// import ShoeDog from '../../ShoeDog';

exports.seed = function(knex, Promise) {
  // delete all entries
  return knex('books')
    .del()
    .then(function() {
      return knex('books').insert([
        {
          id: 1,
          title: 'Shoe Dog',
          author: 'Phil Knight',
          synopsis:
            'Shoe Dog (2016) tells the story of the man behind the famous footwear company Nike. These blinks offer a peek into the mind of genius entrepreneur Phil Knight and detail the rollercoaster ride he went to through to build up his company.',
          cover_img:
            'https://cdn1.imggmi.com/uploads/2019/8/19/31e08cd0fb2b8cef8a946c7ea4a28a0e-full.png',
          publish_date: 'April 26, 2016',
          intro:
            "I'm Phil Knight and I'm the founding CEO of Nike, wanted to share with you a quick preview of my book Shoe Dog",
          created_at: new Date()
        }
      ]);
    });
};
