// Allow absolute paths
require('app-module-path').addPath(__dirname);
// Enable Automated error handling middleware
require('express-async-errors');
const server = require('./server.js');

const port = process.env.PORT || 8000;

server.listen(port, () => console.log(`==========Server on ${port}========`));
