
const Q = require('q');
const bcrypt = require('bcrypt');

const db = require('../db');
const util = require('../util');

// TODO: This should handle Oauth 2 or Oauth1 endpoints
module.exports = class AuthHandler {
  constructor(config) {
    this.config = config;
  }

  login(req, res, next) {
    const _this = this;

    if (!req.body || !req.body.username || !req.body.password) {
      throw new Error('Missing required parameters');
    }
    // Requires that usernames be unique
    return db.findWhere('user', {where: {username: req.body.username}})
      .then(function(existingUser) {
        if (!existingUser) {
          return res.status(401).json({
            message: 'Username or password is incorrect'
          });
        }
        return Q.ninvoke(bcrypt, 'compare', existingUser.password, user.password);
     }) 
     .then(function(isAuthenticated) {
       if (!isAuthenticated) {
         return res.status(401).json({
           message: 'Username or password is incorrect'
         });
       }
       let userData = _.pick(existingUser, [
         'firstname', 'lastname', 'username', 'capabilities'
       ]);
       // Let's hand them back an authorization token
       userData.authToken = util.jwt.createToken(userData); 

       // if all's is good, let's redirect them home
       //return res.status(200).redirect('/home', userData);
       req.user = userData;
       return res.redirect('/', { message: 'success' });
     })
     .catch(function(err) {
       //TODO: Error handler
       console.error(err);
       res.status(500).json({ message: err.message });
     });
  }

};

