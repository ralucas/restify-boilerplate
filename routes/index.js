'use strict';

var heartbeat = require('./heartbeat');

var handlers = require('../handlers');

var mw = {
  authenticate: require('./middleware/authenticate'),
  authorize: require('./middleware/authorize')
};

module.exports = function(server) {

  heartbeat(server);

  server.post('/login',
    mw.authenticate.verify,
    mw.authorize.createToken,
    mw.authorize.createToken,
    handlers.auth.login
  );

};
