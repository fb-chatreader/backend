const bodyParser = require('body-parser');
const router = require('express')
  .Router()
  .use(bodyParser.json());

const Client = require('models/db/clients.js');

const {
  validateWebhook,
  getClientInfo,
  parseWebhook
} = require('middleware/webhooks.js');

const CommandListClass = require('classes/CommandList.js');
const CommandList = new CommandListClass();

router.post(
  '/:client_id',
  validateWebhook,
  getClientInfo,
  parseWebhook,
  async (req, res) => {
    const { event } = req.body.entry[0];

    await CommandList.execute(event);
    return res.sendStatus(200);
  }
);

router.get('/:client_id', async (req, res) => {
  const { client_id } = req.params;
  const client = await Client.retrieve({ id: client_id }).first();

  if (!client) return res.sendStatus(404);

  const { verification_token } = client;

  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

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

router.get('/', (req, res) => {
  return res.status(200).send('API RUNNING!!!');
});
module.exports = router;
