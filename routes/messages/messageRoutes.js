const bodyParser = require('body-parser');
const router = require('express')
  .Router()
  .use(bodyParser.json());

const { verifyWebhook } = require('./middleware.js');
const CommandList = require('./classes/CommandList.js');
const Commands = new CommandList();

router.post('/webhook', verifyWebhook, ({ body: { entry } }, res) => {
  const event = entry[0].messaging[0];
  const sent = Commands.execute(event);
  sent ? res.sendStatus(200) : res.sendStatus(404);
});

router.get('/webhook', (req, res) => {
  let VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('Webhook verified');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(404);
  }
});
module.exports = router;
