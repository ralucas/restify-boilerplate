'use strict';

if (process.env.NODE_ENV !== 'production'){
  require('longjohn');
}

var fs = require('fs');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

var restify = require('restify');
var lusca = require('lusca');
var logger = require('morgan');

var config = require('./config');
var mw = require('./middleware');
var routes = require('./routes');

//TODO: Abstract console api to use bunyan logging

var server = restify.createServer({
  //certificate: fs.readFileSync('config/certs/server.crt'),
  //key: fs.readFileSync('config/certs/server.key'),
  name: 'MyApp'
});

const ignorePaths = [ '/heartbeat' ];

// Middleware
server.use(logger('dev'));
// Use Lusca to prevent some common attacks
server.use(mw.websec());
server.use(mw.authorize(ignorePaths));

// Routes
routes(server);

if (cluster.isMaster && process.env.NODE_ENV == 'production') {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', function(worker, code, signal) {
    console.log('Worker ' + worker.process.pid + ' died:\n' +
      'code: ' + code + ' signal: ' + signal);
  });
  
} else {
  server.listen(config.get('server.port'), function() {
    console.log('%s listening at %s', server.name, server.url);
  });
}

if (process.env.NODE_ENV !== 'production') {
  module.exports = server;
}

