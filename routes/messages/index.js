const bodyParser = require('body-parser');
const router = require('express')
  .Router()
  .use(bodyParser.json());

const { verifyWebhook, formatWebhook } = require('middleware/webhooks.js');

const CommandList = require('./classes/CommandList.js');
const Commands = new CommandList();

router.post('/webhook', verifyWebhook, formatWebhook, (req, res) => {
  const event = req.body.entry[0].input;
  const sent = Commands.execute(event);
  return sent ? res.sendStatus(200) : res.sendStatus(404);
});

router.get('/webhook', (req, res) => {
  let VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
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
  res.status(200).send('API RUNNING!!!');
});
module.exports = router;
