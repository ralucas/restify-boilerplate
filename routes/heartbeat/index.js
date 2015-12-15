// These routes are for testing and pinging
var mw = {
  authorize: require('../middleware/authorize'),
  authenticate: require('../middleware/authenticate')
};

module.exports = function(server) {

  server.get('/heartbeat', function(req, res) {
    res.send(200, {message: 'heartbeat - No Auth'});
  });

  server.get('/heartbeat/resource',
    mw.authorize.verifyToken,
    function(req, res) {
      res.send(200, {message: 'heartbeat - Authenticated'});
    }
  );

  server.post('/heartbeat/resource',
    mw.authorize.verifyToken,
    function(req, res) {
      res.send(201);
    }
  );

  server.put('/heartbeat/resource',
    mw.authorize.verifyToken,
    function(req, res) {
      res.send(201);
    } 
  );

  server.del('/heartbeat/resource',
    mw.authorize.verifyToken,
    function(req, res) {
      res.send(204);
    }
  );

  server.head('/heartbeat/resource',
    mw.authorize.verifyToken,
    function(req, res) {
      res.header('test', 'heartbeat');
    }
  );

  server.post('/heartbeat/login',
    mw.authenticate,
    function(req, res) {
      res.send(302);
    }
  );
};
