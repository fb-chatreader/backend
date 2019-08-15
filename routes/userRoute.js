const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router().use(bodyParser.json());
const Users = require('../models/db/users.js');

router.get('/', async (req, res) => {
  try {
    const users = await Users.retrieve();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      messege: 'failed to retrieve users'
    });
  }
});

module.exports = router;
