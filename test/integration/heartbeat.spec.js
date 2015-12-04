var expect = require('chai').expect;
var request = require('supertest');

var server = require('../../server.js');

describe('GET /heartbeat', function() {
  
  it('should respond with a 200', function(done) {

    request(server)
      .get('/heartbeat')
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        done();
      });
  });

  it('should respond with a message', function(done) {
  
    request(server)
      .get('/heartbeat')
      .expect('Content-Type', /json/)
      .expect(function(res) {
        res.body.message = 'heartbeat';
      })
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

});
