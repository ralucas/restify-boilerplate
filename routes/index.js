'use strict';

var heartbeat = require('./heartbeat');

var handlers = require('../handlers');

module.exports = function(server) {

  heartbeat(server);

};
