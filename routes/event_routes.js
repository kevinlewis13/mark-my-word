'use strict';

var Event = require('../models/Event');
var bodyParser = require('body-parser');

module.exports = function (router) {
  router.use(bodyParser.json());

  router.post('/events', function (req, res) {
    var newEvent = new Event(req.body);
    newEvent.eventTime = Date.parse(req.body.eventTime);
    newEvent.save(function (err, data) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'server error'});
      }
      res.json(data);
    });
  });

  router.get('/events', function (req, res) {
    var now = Date.now();
    var dayOut = Date.now() + 86400000;

    Event.find({eventTime: {$gt: now, $lt: dayOut}}, function (err, data) {
      if (err) {
        console.log(err);
        res.status(500).json({msg: 'server error'});
      }
      res.json(data);
    });
  });
};
