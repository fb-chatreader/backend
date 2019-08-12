"use strict";
const express = require("express");
const cors = require('cors');

// route declarations
const messageRouter = require('./routes/messageRoutes');

const server = express();
server.use(cors());
server.use(express.json());

// routes
server.use('/api/messenger', messageRouter);


server.get('/', (req, res) => {
  res.status(200).json('Welcome to ChatReader server!');
});

module.exports = server;