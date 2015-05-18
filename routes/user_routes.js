// Require in userSchema
var User = require('../models/User');
var bodyParser = require('body-parser');
var validator = require('email-validator');

module.exports = function(router) {
  router.use(bodyParser.json());

  router.get('/login', function(req, res) {
    res.json({msg: 'login hit'});
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
        res.json({msg: 'Account created'});
      });
    });

  });

};
