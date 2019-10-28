const bodyParser = require('body-parser');
const router = require('express')
  .Router()
  .use(bodyParser.json());

const Pages = require('models/db/pages.js');

const {
  validateWebhook,
  getPageData,
  parseWebhook
} = require('middleware/webhooks.js');

const CommandList = require('classes/CommandList.js');

router.post(
  '/',
  validateWebhook,
  getPageData,
  parseWebhook,
  async (req, res) => {
    const { event } = req.body.entry[0];

    await CommandList.run(event);
    return res.sendStatus(200);
  }
);

router.get('/', async (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const page = await Pages.retrieve({ verification_token: token }).first();
  if (!page) return res.sendStatus(404);

  const { verification_token } = page;

  if (mode && token) {
    if (mode === 'subscribe' && token === verification_token) {
      console.log('Webhook verified');
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  } else {
    return res.sendStatus(404);
  }
});

module.exports = router;
