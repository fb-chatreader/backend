// this file is to avoid conflicts will merge into messageRoutes.js when done

const express = require('express');
const bodyParser = require("body-parser");
const router = express.Router().use(bodyParser.json());
const request = require("request");
const db = require('../models/dbConfig');


router.get('/', (req, res) => {
    let VERIFY_TOKEN = process.env.VERIFY_TOKEN;
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];
    

})



module.exports = router;