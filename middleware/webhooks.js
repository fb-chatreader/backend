const Pages = require('models/db/pages.js');

const WebhookEvent = require('classes/WebhookEvent.js');

module.exports = { validateWebhook, getPageData, parseWebhook };

async function validateWebhook({ body: { entry } }, res, next) {
  if (body.object === 'page' && entry && entry[0]) {
    const { id } = entry[0];
    const page = await Pages.retrieve({ id }).first();
    if (!page) return res.sendStatus(404);

    // Initialize a new webhook event, set the page for it
    const Event = new WebhookEvent();
    Event.setPage(page);
    const goodHook = await Event.processHook(entry[0]);
    if (goodHook) {
      next();
    } else {
      return res.sendStatus(400);
    }
  }
}
