/**
 * Middleware for authorization to resources
 * Utilizes JSON Web Tokens
 *
 **/
var fs = require('fs');

var jwt = require('jsonwebtoken');
var config = require('../config');

const pubKey = 'pubKey'; //fs.readFileSync(config.get('certs.publicKey'));

module.exports = function authorize(ignorePaths) {
  return function verifyToken(req, res, next) {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.match(/^Bearer\s(.*)$/)[1];

    if ( ignorePaths.some(path => path == req.getPath()) ) {
      return next();
    }

    if ( !token ) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const verified = jwt.verify(token, pubKey);
    if ( !verified ) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    // TODO: Handle other jwt verification and authorization options here
    req.auth = verified;
    req.isAuthorized = true;
    return next();
  }
}
