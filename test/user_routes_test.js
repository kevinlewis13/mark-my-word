process.env.MONGOLAB_URI = 'mongodb://localhost/mmw_test';
require('../server.js');

var mongoose = require('mongoose');
var chai = require('chai');
var chaihttp = require('chai-http');
var User = require('../models/User');

chai.use(chaihttp);
var expect = chai.expect;

var domain = 'localhost:3000';

var testUser = {
  username: 'RouteTest',
  email: 'testing@example.com',
  password: 'waffles'
};

describe('Mark My Word App User Routes', function() {

  it('should be able to create a user', function(done) {
    chai.request(domain)
      .post('/create_user')
      .send(testUser)
      .end(function(err, res) {
        console.log(err);
        expect(err).to.eql(null);
        expect(typeof res.body.token).to.eql('string');
        done();
      });
  });

  it('should be able to login', function(done) {
    chai.request(domain)
      .get('/login')
      .auth(testUser.email, testUser.password)
      .end(function(err, res) {
        console.log(err);
        expect(err).to.eql(null);
        expect(typeof res.body.token).to.eql('string');
        done();
      });
  });

  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });

});
