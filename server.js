'use strict';
const express = require('express');
const cors = require('cors');

// Jobs
require('./jobs/timedMessages.js');

// route declarations
const messageRouter = require('./routes/messages/messageRoutes');
// const bookRouter = require('./routes/bookRoutes');
// const userRouter = require('./routes/userRoute');
// const summaryRouter = require('./routes/summaryPartRoute');
// const chatReadRouter = require('./routes/chatReadRoute');

// Error handling
const errorHandler = require('./middleware/errorHandling');

const server = express();
server.use(cors());
server.use(express.json());

// routes
server.use('/api/messenger', messageRouter);
// server.use('/api/books', bookRouter);
// server.use('/api/users', userRouter);
// server.use('/api/summaries', summaryRouter);
// server.use('/api/chatReads', chatReadRouter);

server.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to ChatReader server!' });
});

//async error handling middleware MUST come after routes or else will just throw Type error
server.use(errorHandler);

module.exports = server;
