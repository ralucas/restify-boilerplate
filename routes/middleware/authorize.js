/**
 * Middleware for authorization to resources
 * Utilizes JSON Web Tokens
 *
 **/

var jwt = require('jsonwebtoken');

module.exports = {
  /**
   * Creates an authorization token
   * @return {object} - json web token
   **/ 
  createToken: function createToken(req, res, next) {

  },

  /**
   * Verifies a token as valid
   * @return {boolean}
   **/ 
  verifyToken: function verifyToken(req, res, next) {

  }
};
