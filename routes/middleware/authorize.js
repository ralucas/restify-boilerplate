/**
 * Middleware for authorization to resources
 * Utilizes JSON Web Tokens
 *
 **/
var fs = require('fs');

var jwt = require('jsonwebtoken');
var config = require('../../config');

module.exports = {
  /**
   * Creates an authorization token
   * @return {object} - json web token
   **/ 
  createToken: function createToken(req, res, next) {
    var cert = fs.readFileSync(config.certs.privateKey);
    var token = jwt.sign({ foo: 'bar' }, cert, { algorithm: 'RS256'}); 
    req.user.token = token;
    return next();
  },

  /**
   * Verifies a token as valid
   * @return {boolean}
   **/ 
  verifyToken: function verifyToken(req, res, next) {

  }
};
