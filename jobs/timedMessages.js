const TimedMessages = require('../models/db/timedMessages.js');
const Users = require('models/db/users.js');
const Books = require('models/db/books.js');
const Pages = require('models/db/pages.js');
const Message = require('classes/Message.js');

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

      const response = {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [
              {
                title: 'Over 1000 book summaries are waiting for you!',
                image_url: 'https://i.imgur.com/32LoIYe.png',
                subtitle: `Want to get started?`,
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

      const timedMsgCommand = new Message(response, {
        sender: psid,
        page,
        command: 'timed_message'
      });
      timedMsgCommand.sendResponses();
      await TimedMessages.remove(m.id);
      console.log('Sent timed response');
    }
  });
}
