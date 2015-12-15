function AuthHandler() {

}

AuthHandler.prototype.login = function login(req, res) {
  res.redirect('/', {message: 'success'});
};

module.exports = AuthHandler;
