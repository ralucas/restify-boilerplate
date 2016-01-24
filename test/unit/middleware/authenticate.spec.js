var expect = require('chai').expect;
var sinon = require('sinon');
var Q = require('q');

var auth = require('../../../routes/middleware/authenticate.js');
var SqlService = require('../../../services/sql.service.js');

//SETUP
var db, req; 

var config = {
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'test', 
    password: 'test',
    database: 'test' 
  },
  debug: false 
};

beforeEach(function(done) {
  db = new SqlService(config);
  req = {
    body: {
      username: 'test',
      password: 'passwd'
    }
  };
  done();
});


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
      expect(auth.verify.bind(auth, {})).to.throw();
      expect(auth.verify.bind(auth, {})).to.throw(/Missing/);
      done();
    }); 

    it('should call `db.findWhere`', function(done) {
      var stub = sinon.stub(db, 'findWhere');
      stub.returns(Q({a: 1}));
      auth.verify(req);
      expect(stub.called).to.be.true;
      done();
    });

  });
});
