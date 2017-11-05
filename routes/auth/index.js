//Implementing route authorization and checking here
//Utilizes Oauth1.0a and JWT

const handlers = require('../../handlers');

module.exports = (server) => {
  server.post('/login', handlers.auth.login);
  server.get('/authorize', handlers.auth.authorize);
  server.post('/token', handlers.auth.token);
};
