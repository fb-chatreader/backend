'use strict';
const express = require('express');
const cors = require('cors');

// Jobs -- Tasks running on a schedule
require('./jobs/timedMessages.js');

// Import routes
const messageRouter = require('./routes/messages/');
const bookRouter = require('./routes/books/');
const pageRouter = require('./routes/pages/');
const billingRouter = require('./routes/billing/');
const stripeWebhooksRouter = require('./routes/stripe-webhooks');

// Auth middleware
const validateOrigin = require('auth/origin.js');

// Error handling
const errorHandler = require('./middleware/errorHandling');

// Server config
const server = express();
server.use(cors());
server.use(express.json());

// trying to send raw req for stripe signature to verify,
// hence defining this route before app.use(express.json());
server.use('/api/stripe-webhooks', stripeWebhooksRouter);

// Use routes
server.use('/api/messenger', messageRouter);
server.use('/api/books', validateOrigin, bookRouter);
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

server.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  if (!body.name || !body.bio) {
    return res
      .status(400)
      .json({ errorMessage: 'Please provide name and bio for the user' });
  }

  const user = await db.findById(id);

  if (!user) {
    return res
      .status(404)
      .json({ message: 'The user with the specified ID does not exist.' });
  }

  const updated = await db.update(id, body);

  if (!updated) {
    return res
      .status(500)
      .json({ error: 'The user information could not be modified' });
  }

  const updatedUser = await db.findById(id);
  return res.status(200).json(updatedUser);
});
