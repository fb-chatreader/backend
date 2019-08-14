const express = require('express');
const bodyParser = require("body-parser");
const router = express.Router().use(bodyParser.json());
const db = require('../models/dbConfig');
const dbUsers = require('../data/usersDB');

router.get("/", async (req, res) => {
  try {
    const users = await dbUsers.retrieve();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      messege: 'failed to retrieve users'
    });
  }
});


module.exports = router;