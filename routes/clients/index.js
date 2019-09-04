const router = require('express').Router();
const Client = require('models/db/clients.js');

const { validateClient } = require('middleware/clients.js');

router.post('/', validateClient, async (req, res) => {
  const { access_token, name } = req.body;
  const newClient = await Client.add({ access_token, name });

  return newClient
    ? res.status(200).json({
        callback_URL: `${process.env.APP_URL}/api/messenger/${newClient.id}`,
        verification_token: newClient.verification_token
      })
    : res.sendStatus(418);
});

module.exports = router;
