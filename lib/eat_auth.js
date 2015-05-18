var eat = require('eat');
var User = require('../models/User');

var MILLISECONDS_IN_A_WEEK = 604800000;

module.exports = function(secret) {
  return function(req, res, next) {
    var token = req.headers.token || req.body.token;
    // tokens expire after one week
    var expired = Date.now() - MILLISECONDS_IN_A_WEEK;

    if (!token) {
      console.log('not authorized');
      return res.status(401).json({msg: 'not authorized'});
    }

    eat.decode(token, secret, function(err, decoded) {
      if (err) {
        console.log('error decoding token');
        return res.status(500).json({msg: 'not authorized'});
      }

      if (decoded.timestamp < expired) {
        console.log('expired token');
        return res.status(401).json({msg: 'not authorized'});
      }

      user.findOne({uuid: decoded.id}, function(err, user) {
        if (err) {
          console.log(err);
          return res.status(500).json({msg: 'internal service error'});
        }
        if (!user) {
          console.log('no user found for that token');
          return res.status(401).json({msg: 'not authorized'});
        }
        req.user = user;
        next();
      });
    });
  };
};
