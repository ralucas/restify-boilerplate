const expect = require('chai').expect;
const request = require('supertest');

const Server = require('../../server.js');
const { server, wss } = new Server().run();

describe('GET /heartbeat', function() {

  after(function(done) {
    server.close(function() {
      wss.close(function() {
        done();
      })
    });
  });
  
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
