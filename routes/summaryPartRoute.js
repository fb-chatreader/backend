const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router().use(bodyParser.json());
const SummaryParts = require('../models/db/summaryParts.js');

router.get('/', async (req, res) => {
  try {
    const summaries = await SummaryParts.retrieve();
    res.status(200).json(summaries);
  } catch (error) {
    res.status(500).json({
      message: 'failed to retrieve summary'
    });
  }
});

module.exports = router;
