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
          cover_img: '../../ShoeDog.png',
          publish_date: 'April 26, 2016'
        }
      ]);
    });
};
