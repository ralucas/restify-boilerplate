/**
 * Middleware for authentication of users
 *
 **/ 
var bcrypt = require('bcrypt');
var Q = require('q');

// User DB - Using SQL as example
var db = require('../../services').sqlService;

//TODO: Handle the Oauth1.0a authentication flow here
module.exports = {
  verify: function verify(req, res, next) {
    if (!req.body || req.body.username || req.body.password) {
      throw new Error('Missing required parameters');
    }
    // Here we are requiring that usernames be unique
    return db.findWhere('user', {where: {username: req.body.username}})
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
  },

  create: function create(req, res, next) {
    var newUser = req.body;
    if (!newUser || 
        !newUser.username || 
        !newUser.password || 
        !newUser.email
       ) {
      Q.reject('Missing required parameters');
    }
    // first let's make sure the user doesn't exist already
    // TODO: Validating unique usernames?
    return db.findWhere('user', {
      where: {username: newUser.username, email: newUser.email}
    })
    .then(function(user) {
      if (user) return res.status(401).json({'message': 'User exists'});  
      // Let's hash the password with a salt
      return Q.ninvoke(bcrypt, 'genSalt', 24);
    })
    .then(function(salt) {
      // now, let's create the password hash
      // See the blog/readme for why this many iterations
      return Q.ninvoke(bcrypt, 'hash', newUser.password, salt); 
    })
    .then(function(hash) {
      _.extend(newUser, {password: hash});
      return db.create('user', newUser);
    })
    .then(function(result) {
      var userData = _.pick(newUser, 'firstname', 'lastname', 'username');
      //TODO: Redirect here
      //return res.status(200).redirect('/home', userData);
      req.user = userData;
      return next();
    })
    .catch(function(err) {
      return res.status(400).json({message: err.message});
    });
  }
};

