const fs = require('fs');
const path = require('path');

const routes = fs.readdirSync(__dirname).reduce((acc, dir) => {
  if (!dir.match(/index/)) {
    acc[dir] = require(path.join(__dirname, dir));
  }
  return acc;
}, {});

module.exports = function(server) {

  Object.keys(routes).forEach(route => {
    routes[route](server);
  });

};
