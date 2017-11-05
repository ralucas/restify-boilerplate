const jwt = require('jsonwebtoken');

const config = require('../config');

module.exports = {
  createToken: function createToken(payload) {
    const cert = fs.readFileSync(config.get('certs.privateKey'));
    const options = Object.assign({
      algorithm: 'RS256',
      expiresIn: '1h'
    }, config.get('jwt.options'));

    return jwt.sign(payload, cert, options);
  }
};
