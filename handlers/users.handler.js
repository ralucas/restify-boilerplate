
const Q = require('q');
const bcrypt = require('bcrypt');

module.exports = class UsersHandler {
  constructor(config) {
    this.config = config;
  }

  create(req, res, next) {
    var newUser = req.body;
    if (!newUser || 
        !newUser.username || 
        !newUser.password || 
        !newUser.email
       ) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }
    // TODO: Validating unique usernames?
    return db.findWhere('user', {
      where: {username: newUser.username, email: newUser.email}
    })
    .then(function(user) {
      if (user) return res.status(401).json({'message': 'User exists'});  
      return Q.ninvoke(bcrypt, 'genSalt', 24);
    })
    .then(function(salt) {
      return Q.ninvoke(bcrypt, 'hash', newUser.password, salt); 
    })
    .then(function(hash) {
      _.extend(newUser, {password: hash});
      return db.create('user', newUser);
    })
    .then(function(result) {
      var userData = _.pick(newUser, 'firstname', 'lastname', 'username', 'capabilities');
      userData.token = util.jwt.createToken(userData);
      req.user = userData;
      return res.status(200).redirect('/home', userData);
    })
    .catch(function(err) {
      return res.status(500).json({message: err.message});
    });
  }
}
