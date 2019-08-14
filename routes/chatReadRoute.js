const express = require('express');
const bodyParser = require("body-parser");
const router = express.Router().use(bodyParser.json());
const db = require('../models/dbConfig');
const dbChatRead = require('../data/chatReadDB');

router.get("/", async (req, res) => {
  try {
    const chatReads = await dbChatRead.retrieve();
    res.status(200).json(chatReads);
  } catch (error) {
    res.status(500).json({
      messege: 'failed to retrieve chat read'
    });
  }
});


module.exports = router;