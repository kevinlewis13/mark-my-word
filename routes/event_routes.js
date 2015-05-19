'use strict';

var Event = require('../models/Event');
var bodyParser = require('body-parser');
var url = require('url');

module.exports = function (router) {
  router.use(bodyParser.json());

  router.post('/events', function (req, res) {
    var newEvent = new Event(req.body);
    var question = {};
    question.title = req.body.question;
    newEvent.questions.push(question);
    newEvent.eventTime = Date.parse(req.body.eventTime);
    newEvent.eventTimeString = req.body.eventTime;
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

  router.put('/events/:id', function(req, res) {

    var update = req.body;

    Event.update({'_id': req.params.id},{$addToSet:{questions: update}}, function(err, data) {
      if(err){
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }
      res.json({msg: "Put: Nailed it"});
    });
  });

  router.post('/events/:id', function(req, res) {
    var parsedUrl = url.parse(req.url);
    var update = req.body;

    Event.update({'_id': req.params.id},{$addToSet:{questions: update}}, function(err, data) {
      if(err){
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }
      res.json({msg: "Post Update: Nailed it"});
    });
  });
};

