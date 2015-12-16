'use strict';

var knex = require('knex');
var _ = require('lodash');
var Q = require('q');

var models = require('../models/sql');

function SqlService(config) {
  this.config = _.defaultsDeep({
    client: process.env.SQL_CLIENT,
    connection: {
      host: process.env.SQL_DB_HOST,
      user: process.env.SQL_DB_USER, 
      password: process.env.SQL_DB_PASSWORD,
      database: process.env.SQL_DB_NAME
    },
    debug: true//process.env.SQL_DB_DEBUG || false 
  }, config);

  if (process.env.SQL_DB_POOL) {
    this.config.pool = {
      min: process.env.SQL_DB_POOL_MIN,
      max: process.env.SQL_DB_POOL_MAX
    };
  }

  this.client = knex(this.config);

  this.initialize(models);
}

//TODO: Move this to a seed task
SqlService.prototype.initialize = function initialize(models) {
  var knexClient = this.client;
  _.forEach(models, function(schema, model) {
    knexClient.schema.createTableIfNotExists(model, schema)
      .then(function(msg) {
        console.log('CREATED: ', msg);
      });
  });
};

SqlService.prototype.findWhere = function find(table, options) {
  if (!table) {
    return Q.reject('Table name is required');
  }

  //var query = _.pairs(options).map(function(option) {
    //return '[\"' + option[0] + '\"](' + JSON.stringify(option[1]) + ')';
  //}).join('');

  var query = {};

  if (options && _.isObject(options)) {
    query = options.where ? options.where : options;
  }

  return this.client(table)['where'](query);
};

SqlService.prototype.findOne = function findOne(table, options) {
  if (!table) {
    return Q.reject('Table name is required');
  }

  var query = _.pairs(options).map(function(option) {
    return '[\"' + option[0] + '\"](' + JSON.stringify(option[1]) + ')';
  }).join('');

  return this.client(table)(query);
};

SqlService.prototype.create = function create(table, options) {

};

module.exports = SqlService;

