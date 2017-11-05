const lusca = require('lusca');

module.exports = function websec(config) {
  return function(req, res, next) {
    lusca({
      csrf: true,
      csp: { 
        policy: {
          'default-src': '\'self\''
        }
      },
      xframe: 'SAMEORIGIN',
      p3p: 'ABCDEF',
      hsts: {maxAge: 31536000, includeSubDomains: true, preload: true},
      xssProtection: true
    });
    return next();
  };
};
