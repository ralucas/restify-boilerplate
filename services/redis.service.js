var redis = require('redis');
var _ = require('lodash');
var Q = require('q');

function RedisService(config) {
  this.config = config || _.extend({}, {port: 6379, hostname: '127.0.0.1', options: {}});

  if (this.config.client) {
    this.client = this.config.client;
  } else {
    if (config && config.path) {
      this.client = redis.createClient(config.path);
    } else {
      this.client = redis.createClient(this.config.port, this.config.hostname, this.config.options);
    }
  }
  if (config && config.password) this.client.auth(config.password);

  this.client.on('error', console.warn);

  //set up monitoring for redis
  this.monitorClient = redis.createClient();

  this.monitorClient.monitor(function (err, res) {
    if (err) console.error('Error with monitoring mode: ', err, err.stack);
    console.log("Entering monitoring mode.");
  });

  this.monitorClient.on("monitor", function (time, args) {
    console.log(time + ": " + args);
  });

}

RedisService.prototype.method = function(method, args) {
  return Q.npost(this.client, method, args); 
};

module.exports = RedisService;
