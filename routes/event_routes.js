'use strict';

var Event = require('../models/Event');
var bodyParser = require('body-parser');

module.exports = function (router) {
  router.use(bodyParser.json());

  router.post('/events', function (req, res) {
    var newEvent = new Event(req.body);
    newEvent.save(function (err, data) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'server error'});
      }
      res.json(data);
    });
  });

  router.get('/events', function (req, res) {
    Event.find({}, function (err, data) {
      if (err) {
        console.log(err);
        res.status(500).json({msg: 'server error'});
      }
      res.json(data);
    });
  });
};

