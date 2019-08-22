const request = require('supertest');
const server = require('./server.js');

// testing endpoints
// returns correct http status code

describe('server.js', () => {
  describe('GET /', () => {
    it('should respond with 200 OK', () =>
      request(server)
        .get('/')
        .then(response => expect(response.status).toBe(200)));

    it('should return JSON', () =>
      request(server)
        .get('/')
        .then(res => expect(res.type).toBe('application/json')));
  });
});
