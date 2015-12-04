'use strict';

var fs = require('fs');
var _  = require('lodash');

var srcDir = _.remove(fs.readdirSync('./'), function(dir) {
  return !/\.|node_modules|test/.test(dir);
});

require('blanket')({
  pattern: srcDir
});
