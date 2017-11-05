// These routes are for testing and pinging

module.exports = function(server) {

  server.get('/heartbeat', function(req, res) {
    res.send(200, {message: 'Good'});
  });
};
