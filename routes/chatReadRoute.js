const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router().use(bodyParser.json());
const ChatRead = require('../models/db/chatReads.js');

router.get('/', async (req, res) => {
  try {
    const chatReads = await ChatRead.retrieve();
    res.status(200).json(chatReads);
  } catch (error) {
    res.status(500).json({
      messege: 'failed to retrieve chat read'
    });
  }
});

module.exports = router;
