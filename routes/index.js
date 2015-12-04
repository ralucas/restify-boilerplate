'use strict';

var api = {
  handlers: require('./handlers'),
  managers: require('./managers'),
  services: require('./services')
};

module.exports = function(server) {

  server.get('/heartbeat', function(req, res) {
    res.send(200, {message: 'heartbeat'});
  });

};
