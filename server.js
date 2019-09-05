'use strict';
const express = require('express');
const cors = require('cors');

// Jobs -- Tasks running on a schedule
require('./jobs/timedMessages.js');

// Import routes
const messageRouter = require('./routes/messages/');
const bookRouter = require('./routes/books/');
const clientRouter = require('./routes/clients/');

// Error handling
const errorHandler = require('./middleware/errorHandling');

// Server config
const server = express();
server.use(cors());
server.use(express.json());

// Use routes
server.use('/api/messenger', messageRouter);
server.use('/api/books', bookRouter);
server.use('/api/clients', clientRouter);

server.get('/', (req, res) => {
  return res.send(200).json({ message: 'Welcome to ChatReader server!' });
});

// Default 404 route
server.get('*', function(req, res) {
  return res.status(404).send('Sorry, that is not a valid route');
});

//async error handling middleware MUST come after routes or else will just throw Type error
server.use(errorHandler);

module.exports = server;
