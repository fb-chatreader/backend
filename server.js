'use strict';
const express = require('express');
const cors = require('cors');

// Jobs -- Tasks running on a schedule
require('./jobs/timedMessages.js');

// routes
const messageRouter = require('./routes/messages/');
const bookRouter = require('./routes/books/');
const categoryRouter = require('./routes/categories/');

// Error handling
const errorHandler = require('./middleware/errorHandling');

const server = express();
server.use(cors());
server.use(express.json());

// routes
server.use('/api/messenger', messageRouter);
server.use('/api/books', bookRouter);
server.use('/api/category', categoryRouter);

server.get('/', (req, res) => {
  return res.send(200).json({ message: 'Welcome to ChatReader server!' });
});

//async error handling middleware MUST come after routes or else will just throw Type error
server.use(errorHandler);

module.exports = server;
