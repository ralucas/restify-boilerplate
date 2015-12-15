'use strict';

var knex = require('knex');
var _ = require('lodash');
var Q = require('q');

function SqlService(config) {
  this.config = _.defaultsDeep({
    client: process.env.SQL_CLIENT,
    connection: {
      host: process.env.SQL_DB_HOST,
      user: process.env.SQL_DB_USER, 
      password: process.env.SQL_DB_PASSWORD,
      database: process.env.SQL_DB_NAME
    },
    debug: process.env.SQL_DB_DEBUG || false 
  }, config);

  if (process.env.SQL_DB_POOL) {
    this.config.pool = {
      min: process.env.SQL_DB_POOL_MIN,
      max: process.env.SQL_DB_POOL_MAX
    };
  }

  console.log('knexconf', this.config);
  this.client = knex(this.config);
}

//TODO: This is untested...not sure if it will work
SqlService.prototype.find = function find(table, options) {
  if (!table) {
    return Q.reject('Table name is required');
  }

  var query = _.pairs(options).map(function(option) {
    return '[\"' + option[0] + '\"](' + JSON.stringify(option[1]) + ')';
  }).join('');

  return this.client(table)(query);
};

module.exports = SqlService;
