var expect = require('chai').expect;
var request = require('supertest');

var server = require('../../server.js');

describe('GET /heartbeat', function() {
  
  it('should respond with a 200 and a message', function(done) {

    request(server)
      .get('/heartbeat')
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        expect(res.body.message).to.exist;
        done();
      });
  });

});
