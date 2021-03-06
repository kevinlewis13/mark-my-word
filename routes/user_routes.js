// Require in userSchema
var User = require('../models/User');
var Event = require('../models/Event');
var Vote = require('../models/Vote');
var bodyParser = require('body-parser');
var validator = require('email-validator');
var eatAuth = require('../lib/eat_auth')(process.env.APP_SECRET);
var getUser = require('./getUser');

module.exports = function(router, passport) {
  router.use(bodyParser.json());

  // login to recieve a new access token
  router.get('/login', passport.authenticate('basic', {session: false}), function(req, res) {
    req.user.generateToken(process.env.APP_SECRET, function(err, token) {
    	if(err) {
    		console.log(err);
    		return res.status(500).json({msg: 'error generating token'});
    	}
    	res.status(200).json({token: token});
    });
  });

  // will return a summary view of the user
  router.get('/user', eatAuth, getUser);

  // Create a new user
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

  // remove a user from the Users collection
  router.delete('/delete_user', eatAuth, function(req, res) {
    User.findOneAndRemove({uuid: req.user.uuid}, function() {
      console.log('Your account was successfully deleted');
      res.status(200).json({msg: 'account deletion successful'});
    });
  });

};
