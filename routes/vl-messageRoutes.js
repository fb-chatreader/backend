// this file is to avoid conflicts will merge into messageRoutes.js when done

const express = require('express');
const bodyParser = require("body-parser");
const router = express.Router().use(bodyParser.json());
const request = require("request");
const db = require('../models/dbConfig');






module.exports = router;