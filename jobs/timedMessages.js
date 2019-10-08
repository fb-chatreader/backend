const TimedMessages = require('../models/db/timedMessages.js');
const Users = require('models/db/users.js');
const Pages = require('models/db/pages.js');
const Message = require('classes/Message.js');
const GenericTemplate = require('routes/messages/UI/GenericTemplate.js');

module.exports = setInterval(cycleMessages, 1000 * 60 * 30);

async function cycleMessages() {
  console.log('Cycling through timed messages');
  const messages = await TimedMessages.retrieve();
  const now = new Date();

  messages.forEach(async m => {
    if (new Date(m.send_at) <= now) {
      const user = await Users.retrieve({ id: m.user_id }).first();
      // This gets us around having to add a page_id column to the timed_messages
      // table but likely won't work long term if books lose the page_id column
      const page = await Pages.retrieve({ id: m.page_id }).first();
      const psid = user.facebook_id;

      const response = GenericTemplate([
        {
          title: 'Over 1000 book summaries are waiting for you!',
          image_url: 'https://i.imgur.com/UdZlgQA.png',
          subtitle: `Want to get started?`,
          buttons: [
            {
              type: 'postback',
              title: 'Get Started',
              payload: JSON.stringify({ command: 'browse' })
            }
          ]
        }
      ]);

      const timed = new Message(
        {
          sender: psid,
          page,
          command: 'timed_message'
        },
        [response]
      );

      await timed.respond();
      await TimedMessages.remove(m.id);
      console.log('Sent timed response');
    }
  });
}
