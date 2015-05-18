// Require in userSchema
// var User = require('');
var bodyParser = require('body-parser');

module.exports = function(router) {
  router.use(bodyParser.json());

  router.get('/login', function(req, res) {
    res.json({msg: 'login hit'});
  });

  router.post('/createuser', function(req, res) {
    res.json({msg: 'create user'});
  });

};
