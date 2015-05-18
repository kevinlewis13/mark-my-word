var Basic = require('passport-http').BasicStrategy;
var User = require('../models/User');

module.exports = function(passport) {
  passport.use('basic', new Basic({}, function(email, password, done) {
    User.findOne({'basic.email': email}, function(err, user) {
      if (err) {
        return done('There was an error processing your request');
      }
      if (!user) {
        return done('There was an error with your username/password');
      }
      user.checkPassword(password, function(err, data) {
        if (err) {
          return done('There was an error with your username/password');
        }
        return done(null, user);
      });
    });
  }));
};
