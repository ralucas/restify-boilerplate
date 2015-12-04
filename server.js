'use strict';

var restify = require('restify');

var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
var fs = require('fs');

var routes = require('./routes');

//TODO: Abstract console api to use bunyan logging

var server = restify.createServer({
  certificate: fs.readFileSync('config/certs/server.crt'),
  key: fs.readFileSync('config/certs/server.key'),
  name: 'MyApp'
});

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
  server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
  });
}

if (process.env.NODE_ENV !== 'production') {
  module.exports = server;
}

