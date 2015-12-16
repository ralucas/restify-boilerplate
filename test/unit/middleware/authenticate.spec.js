var expect = require('chai').expect;

var auth = require('../../../routes/middleware/authenticate.js');

describe('Authenticate middleware', function() {

  it('should have `verify` and `create` props', function() {
    expect(auth).to.include.keys('verify');
    expect(auth).to.include.keys('create');
  });

  it('should have `verify` and `create` as methods', function() {
    expect(auth.verify).to.be.a('function');
    expect(auth.create).to.be.a('function');
  });

  describe('verify', function() {

    it('should reject if no body', function(done) {
      expect(auth.verify).to.throw();
      done();
    }); 
  });
});
