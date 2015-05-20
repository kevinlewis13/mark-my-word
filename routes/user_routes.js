// Require in userSchema
var User = require('../models/User');
var bodyParser = require('body-parser');
var validator = require('email-validator');
var eatAuth = require('../lib/eat_auth')(process.env.APP_SECRET);

module.exports = function(router, passport) {
  router.use(bodyParser.json());

  router.get('/login', passport.authenticate('basic', {session: false}), function(req, res) {
    req.user.generateToken(process.env.APP_SECRET, function(err, token) {
    	if(err) {
    		console.log(err);
    		return res.status(500).json({msg: 'error generating token'});
    	}
    	res.status(200).json({token: token});
    });
  });

  router.get('/dashboard', eatAuth, function(req, res) {
    var user = {
      username: req.user.username,
      email: req.user.basic.email,
      events: req.user.events
    };
    return res.status(200).json(user);
  });

  // To create a new user send an object with username, password and email
  // properties.
  router.post('/create_user', function(req, res) {
    var newUser = new User();
    if (!validator.validate(req.body.email)) {
      return res.json({errorCode: 2,
        msg: 'A valid email address is required'});
    }
    newUser.username = req.body.username;
    newUser.basic.email = req.body.email;
    newUser.generateUuid();
    newUser.generateHash(req.body.password, function(err, hash) {
      if (err) {
        return res.status(500).json({msg: 'Account could not be created'});
      }
      newUser.basic.password = hash;
      newUser.save(function(err, user) {
        if (err) {
          console.log(err);
          return res.status(500).json({msg: 'Account could not be created'});
        }
        // Return a token
        newUser.generateToken(process.env.APP_SECRET, function(err, token) {
          if (err) {
            console.log(err);
            return res.status(500).json({msg: 'Internal Server Error'});
          }
          res.status(200).json({token: token});
        });
      });
    });
  });

  router.delete('/delete_user', eatAuth, function(req, res) {
    User.findOneAndRemove({uuid: req.user.uuid}, function() {
      console.log('Your account was successfully deleted');
      res.status(200).json({msg: 'account deletion successful'});
    });
  });

};
