const Pages = require('models/db/pages.js');

const WebhookEvent = require('classes/WebhookEvent.js');

module.exports = { validateWebhook };

async function validateWebhook({ body: { entry, object } }, res, next) {
  try {
    if (object === 'page' && entry && entry[0]) {
      const { id } = entry[0];
      const page = await Pages.retrieve({ id }).first();

      if (!page) {
        console.error('Page not found: ', page, 'from', id);
        return res.sendStatus(404);
      }
      // Initialize a new webhook event, set the page for it
      entry[0].Event = new WebhookEvent(page);
      const validHook = await entry[0].Event.processHook(entry[0]);

      return validHook ? next() : res.sendStatus(400);
    }
    return res.sendStatus(400);
  } catch (err) {
    console.error('Something went wrong validating the webhook event: ', err);
    // Sending a 500+ error seems to time FB sending webhook events out, which is a disaster
    // for productivity on the bot.  So if something crashes, try to send a 400 instead.
    return res.sendStatus(400);
  }
}
