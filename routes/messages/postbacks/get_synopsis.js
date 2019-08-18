const Command = require('../classes/Command.js');
const Books = require('../../../models/db/books.js');
module.exports = async event => {
  // When this code is finalized, the id should be in the 'event' but for right now
  // We're hard coding until that UI is built out.

  /* HARD CODED */
  const id = 1;
  const book = await Books.retrieve({ id }).first();
  // retrieve book where id === 1
  // book = {id, author}
  // console.log(book, '<<<<<<<<<<<<<<')
  /*
  book = 
  { id: 1,
  title: 'Shoe Dog',
  author: 'Phil Knight',
  synopsis:
   'Shoe Dog (2016) tells the story of the man behind the famous footwear company Nike. These blinks offer a peek into the mind of
genius entrepreneur Phil Knight and detail the rollercoaster ride he went to through to build up his company.',
  cover_img: '../../ShoeDog.png',
  publish_date: 2016-04-26T04:00:00.000Z,
  created_at: 2019-08-15T20:10:51.290Z,
  updated_at: 2019-08-15T20:10:51.292Z } '<<<<<<<<<<<<<<'*/


  const response = {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'button',
        text: book.synopsis,
        buttons: [
          {
            type: 'postback',
            title: 'Start Summary',
            payload: 'get_summary'
          }
        ]
      }
    }
  };
/**
 * response = text: 'Shoe Dog (2016) tells the story of the man behind the famous footwear company Nike. These blinks offer a peek into the mind of
genius entrepreneur Phil Knight and detail the rollercoaster ride he went to through to build up his company.',
  button with titlt 'start summary; 
  Payload sent back to your webhook in a messaging_postbacks event 
   1000 character limit.payload 
 */
  new Command(response, event).sendResponse();
};
