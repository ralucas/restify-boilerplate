/**
 * Middleware for authentication of users
 *
 **/ 
var bcrypt = require('bcrypt');
var Q = require('q');

// User DB - Using SQL as example
var db = require('../../services').sqlService;

//TODO: Handle the Oauth1.0a authentication flow here
module.exports = function authenticate(req, res, next) {
  if (!req.body || req.body.username || req.body.password) {
    Q.reject('Missing required parameters');
  }
  // Here we are requiring that usernames be unique
  return db.findOne('user', {where: {username: user.username}})
    .then(function(existingUser) {
      if (!existingUser) {
        return res.status(401).json({
          'message': 'Username or password is incorrect'
        });
      }
      // Let's compare the password with what we've got
      return Q.ninvoke(bcrypt, 'compare', existingUser.password, user.password);
   }) 
   .then(function(isAuthenticated) {
     // if the password doesn't authenticate in our comparision, let's send them the same message
     if (!isAuthenticated) {
       return res.status(401).json({
         'message': 'Username or password is incorrect'
       });
     }
     // Let's set some userData for use by the application
     // Be sure to not include any potentially private data here
     var userData = _.pick(existingUser, 'firstname', 'lastname', 'username');
     // Let's hand them back an authorization token


     // if all's is good, let's redirect them home
     //return res.status(200).redirect('/home', userData);
     req.user = userData;
     return next();
   });
};

