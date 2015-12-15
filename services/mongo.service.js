'use strict';

var mongoose = require('mongoose');
var db = mongoose.connection;
var _ = require('lodash');
var Q = require('q');

var Models = require('../models/mongo');

function MongoService(config) {
  this.config = config || {};

  _.defaults(this.config, {
    host: process.env.MONGO_HOST + process.env.MONGO_DB_NAME
  });

  var dbUrl = this.config.host;

  var dbEvents = ['error', 'connecting', 'connected', 'open', 'disconnecting', 'disconnected', 'close', 'reconnected', 'fullsetup'];
  dbEvents.forEach(function(evt) {
    db.on(evt, console.log.bind(console, 'MongoDb ' + evt + ' '));
  });

  mongoose.connect(dbUrl);
}

MongoService.prototype.create = function create(data, model) {
  var modelInstance = new Models[model](data);
  return Q.npost(modelInstance, 'save');
};

MongoService.prototype.updateOrCreate = function updateOrCreate(data, model) {
  return Q.npost(Models[model], 'findById', [data._id])
    .then(function(instance) {
      if (instance) {
        _.extend(instance, data);
        return Q.nfcall(instance.save);
      } else {
        var modelInstance = new Models[model](data);
        return Q.nfcall(modelInstance.save);
      }
    });
};

MongoService.prototype.find = function find(model) {
  return Q.npost(Models[model], 'find', {});
};

MongoService.prototype.findById = function findById(id, model) {
  return Q.npost(Models[model], 'findById', [id]); 
};

MongoService.prototype.deleteAll = function deleteAll(model){
  return Q.npost(Models[model], 'remove', {});
};

module.exports = MongoService;
