"use strict";
const express = require("express");
// const cors = require('cors');

// route declarations
const messageRouter = require('./routes/messageRoutes');
const bookRouter = require('./routes/bookRoutes')
const userRouter = require('./routes/userRoute')
const summaryRouter = require('./routes/summaryPartRoute')
const chatReadRouter = require('./routes/chatReadRoute')

const server = express();
// server.use(cors());
server.use(express.json());

// routes
server.use('/api/messenger', messageRouter);
server.use('/api/books', bookRouter);
server.use('/api/users', userRouter);
server.use('/api/summaries', summaryRouter);
server.use('/api/chatReads', chatReadRouter)

server.get('/', (req, res) => {
  res.status(200).json('Welcome to ChatReader server!');
});

module.exports = server;