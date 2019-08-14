const express = require('express');
const bodyParser = require("body-parser");
const router = express.Router().use(bodyParser.json());
const db = require('../models/dbConfig');
const dbSummaryParts = require('../data/summaryPartsDB');

router.get("/", async (req, res) => {
  try {
    const summeries = await dbSummaryParts.retrieve();
    res.status(200).json(summeries);
  } catch (error) {
    res.status(500).json({
      messege: 'failed to retrieve summary'
    });
  }
});


module.exports = router;