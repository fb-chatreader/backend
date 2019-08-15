const knex = require('knex');

const dbEnvironment = process.env.DB_ENVIRONMENT || 'development';
console.log(`\n\nDeploying ${dbEnvironment} build\n\n`);
const config = require('../knexfile')[dbEnvironment];

module.exports = knex(config);
