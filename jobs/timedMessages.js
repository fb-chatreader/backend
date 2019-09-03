const TimedMessages = require('../models/db/timedMessages.js');
const Books = require('../models/db/books.js');
const Users = require('../models/db/users.js');
const Command = require('classes/Message.js');

module.exports = setInterval(cycleMessages, 1000 * 60 * 30);

async function cycleMessages() {
  console.log('Cycling through timed messages');
  const messages = await TimedMessages.retrieve();
  const now = new Date();

  messages.forEach(async m => {
    if (new Date(m.send_at) <= now) {
      const book = await Books.retrieve({ id: m.book_id }).first();
      const user = await Users.retrieve({ id: m.user_id }).first();
      const psid = user.facebook_id;

      const response = {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [
              {
                title: 'Would you like to read more books like this?',
                image_url: 'https://i.imgur.com/32LoIYe.png',
                subtitle: `${book.title} by ${book.author}`,
                buttons: [
                  {
                    type: 'postback',
                    title: 'Get Started',
                    payload: 'get_started'
                  }
                ]
              }
            ]
          }
        }
      };

      const timedMsgCommand = new Command(response, { sender: { id: psid } });
      timedMsgCommand.sendResponses();
      await TimedMessages.remove(m.id);
      console.log('Sent timed response');
    }
  });
}
