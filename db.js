const config = require('./config');

// Services or Models?
const db = require('./services')[config.get('database.name')];

module.exports = db;
