const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router().use(bodyParser.json());

const { verifyWebhook } = require('./messages/middleware.js');
const CommandList = require('./messages/classes/CommandList');
const Commands = new CommandList();


router.get('/', (req, res) => {
    // console.log('booting up')
    res.status
});

router.post('/webhook', (req, res) => {
    res.sendStatus(200);
});

module.exports = router;

