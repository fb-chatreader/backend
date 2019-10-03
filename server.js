'use strict';
const express = require('express');
const cors = require('cors');

// Jobs -- Tasks running on a schedule
require('./jobs/timedMessages.js');

require('./jobs/bookRatings.js')();

// Import routes
const messageRouter = require('./routes/messages/');
const bookRouter = require('./routes/books/');
const pageRouter = require('./routes/pages/');
const billingRouter = require('./routes/billing/');
const stripeWebhooksRouter = require('./routes/stripe-webhooks');

// Error handling
const errorHandler = require('./middleware/errorHandling');

// Server config
const server = express();
server.use(cors());

// trying to send raw req for stripe signature to verify,
// hence defining this route before app.use(express.json());
server.use('/api/stripe-webhooks', stripeWebhooksRouter);

server.use(express.json());

// Use routes
server.use('/api/messenger', messageRouter);
server.use('/api/books', bookRouter);
server.use('/api/pages', pageRouter);
server.use('/api/billing', billingRouter);

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
