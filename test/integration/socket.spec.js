const expect = require('chai').expect;
const WebSocket = require('ws');

const Server = require('../../server.js');

const WebSocketServer = require('../../socket');

describe('Socket Server', function() {
  let server, wss;

  beforeEach(function(done) {
    ({ server, wss } = new Server().run());
    done();
  });

  afterEach(function (done) {
    server.close(function () {
      wss.close(function () {
        done();
      });
    });
  });

  describe('instantiation', function() {
    it('should instantiate', function(done) {
      expect(wss).to.exist;
      expect(wss).to.be.an.instanceof(WebSocketServer);
      done();
    });
  });

  describe('CONNECTION /ws', function() {
    it('should successfully connect and ping', function (done) {
      const wsClient = new WebSocket('ws://localhost:8081/ws');
      wsClient.on('ping', (msg) => {
        expect(msg.toString()).to.equal('connected');
        done();
      });
    });
  });

});
