process.env.MONGOLAB_URI = 'mongodb://localhost/mmw_test';
require('../server.js');

var mongoose = require('mongoose');
var chai = require('chai');
var chaihttp = require('chai-http');
var User = require('../models/User');
var Event = require('../models/Event');
chai.use(chaihttp);
var expect = chai.expect;
var domain = 'localhost:3000';

var date = Date.now();
var oneDay = 86400000;
var dateTomorrow = new Date(date + oneDay);
var dateYesterday = new Date(date - oneDay);

var testEvent = {
  home:"Mariners",
  away:"Red Sawx",
  eventTime:"May 21 2015 16:00:00 UTC"
};

var tomorrowEvent = {
  home:"TOMORROW",
  away:"Orioles",
  eventTime: dateTomorrow.toString()
};

var yesterdayEvent = {
  home:"YESTERDAY",
  away:"Yankeees",
  eventTime: dateYesterday.toString()
};

var testUser = {
  username: 'RouteTest',
  email: 'testing@example.com',
  password: 'waffles'
};

describe('Mark My Word App Event Routes', function() {

  var testEventId;
  var testToken;

  before(function(done) {
    chai.request(domain)
      .post('/create_events')
      .send(tomorrowEvent)
      .end(function(err, res) {
        if (err) {
          console.log(err);
          return done();
        }
        testEventId = res.body._id;
        return;
      });
      
    chai.request(domain)
      .post('/create_events')
      .send(yesterdayEvent)
      .end(function(err, res) {
         if (err) {
          console.log(err);
          return done();
        }
    });

    chai.request(domain)
      .post('/create_user')
      .send(testUser)
      .end(function(err, res) {
         if (err) {
          console.log(err);
          return done();
        }
        testToken = res.body.token;
        done();
    });

  });

  it('Should create an event', function(done){
    chai.request(domain)
      .post('/create_events')
      .send(testEvent)
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(typeof res.body).to.eql('object');
        expect(res.body.home).to.eql('Mariners');
        expect(res.body.away).to.eql('Red Sawx');
        expect(res.body.eventTimeString).to.eql('May 21 2015 16:00:00 UTC');
        expect(res.body.eventTimeUnix).to.eql(1432224000000);
        done();
      });
  });

  it('Should return a list of events happening in the next 24 hours', function(done) {
    chai.request(domain)
      .get('/events')
      .auth({token: testToken})
      .end(function(err, res) {
        expect(typeof res.body).to.eql('object');
        expect(res.body.length).to.eql(1);
        expect(res.body[0].home).to.eql('TOMORROW');
        expect(res.body[0].home).to.not.eql('YESTERDAY');
        done();
      });
  });

  // it('Should get info from a specific event', function(done) {
  //   done();
  // });

  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });

});
