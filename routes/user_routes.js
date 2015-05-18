// Require in userSchema
var User = require('../models/User');
var bodyParser = require('body-parser');
var validator = require('email-validator');
var eatAuth = require('../lib/eat_auth')(process.env.APP_SECRET);

module.exports = function(router, passport) {
  router.use(bodyParser.json());

  router.get('/login', passport.authenticate('basic', {session: false}), function(req, res) {
    req.user.generateToken(process.env.APP_SECRET, function(err, data) {
    	if(err) {
    		console.log(err);
    		return res.status(500).json({msg: 'error generating token'})
    	}
    	res.json({token: data});
    });
  });
  // To create a new user send an object with username, password and email
  // properties.
  router.post('/createuser', function(req, res) {
    var newUser = new User();
    if (!validator.validate(req.body.email)) {
      return res.json({msg: 'A valid email address is required'});
    }
    newUser.username = req.body.username;
    newUser.basic.email = req.body.email;
    newUser.generateUuid();
    newUser.generateHash(req.body.password, function(err, hash) {
      if (err) {
        return res.status(500).json({msg: 'Account could not be created'});
      }
      newUser.basic.password = hash;
      newUser.save(function(err, data) {
        if (err) {
          console.log(err);
          res.status(500).json({msg: 'Account could not be created'});
        }
        // Return a token
        newUser.generateToken(process.env.APP_SECRET, function(err, data) {
          if (err) {
            console.log(err);
            return res.status(500).json({msg: 'Internal Service Error'});
          }
          res.json({token: data});
        });
      });
    });
  });

};
