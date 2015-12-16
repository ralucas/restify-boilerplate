var SqlService = require('../../../services/sql.service.js');

var expect = require('chai').expect;
var sinon = require('sinon');

//SETUP
var sqlService;

var config = {
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'test', 
    password: 'test',
    database: 'test' 
  },
  debug: true
};

beforeEach(function(done) {
  sqlService = new SqlService(config);
  done();
});

//TESTS
describe('SqlService', function() {

  describe('initialize', function() {

  });

  describe('findWhere', function() {
    it('should find the `test user` when `where` options passed', function(done) {
      sqlService.findWhere('users', {where: {username: 'test'}})
        .then(function(result) {
          expect(result[0]).to.be.an('object');
          expect(result[0].firstname).to.equal('Test');
          expect(result[0].lastname).to.equal('User');
          expect(result[0].username).to.equal('test');
          done();
        });
    });

    it('should find all `users` if no options passed', function(done) {
      sqlService.findWhere('users')
        .then(function(result) {
          expect(result).to.be.an('array');
          expect(result).to.have.length.above(1);
          done();
        });
    });
  });
});
