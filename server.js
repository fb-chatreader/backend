"use strict";
const express = require('express');
const cors = require('cors');

// route declarations
const messageRouter = require('./routes/messageRoutes.js');
const booksRouter = require('./bookRoute/bookRoutes.js');

const server = express();
server.use(cors());
server.use(express.json());

// routes
server.use('/api/messenger', messageRouter);
server.use('/api/books', booksRouter)

server.get('/', (req, res) => {
  res.status(200).json('Welcome to ChatReader server!');
});

module.exports = server;