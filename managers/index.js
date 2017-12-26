const fs = require('fs');
const path = require('path');

module.exports = fs.readdirSync(__dirname).reduce((acc, file) => {
  if (file != 'index.js' && file != 'manager.js') {
    const Klass = require(path.join(__dirname, file));
    const name = file.split('.')[0];
    acc[name] = new Klass();
  }
  return acc;
}, {});

