const bodyParser = require('body-parser');
const router = require('express')
  .Router()
  .use(bodyParser.json());

const Client = require('models/db/clients.js');

const { verifyWebhook, formatWebhook } = require('middleware/webhooks.js');

const CommandListClass = require('classes/CommandList.js');
const CommandList = new CommandListClass();

router.post('/:client_id', verifyWebhook, formatWebhook, (req, res) => {
  const input = req.body.entry[0].input;
  const sent = CommandList.execute(input);
  return sent ? res.sendStatus(200) : res.sendStatus(404);
});

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
