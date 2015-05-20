'use strict';

var Event = require('../models/Event');
var User = require('../models/User');
var Vote = require('../models/Vote');
var bodyParser = require('body-parser');
var url = require('url');
var eatAuth = require('../lib/eat_auth')(process.env.APP_SECRET);

module.exports = function (router) {
  router.use(bodyParser.json());

//POST ROUTES

  router.post('/create_events', function (req, res) {
    var newEvent = new Event(req.body);
    var question = {};
    question.question = req.body.question;
    newEvent.questions.push(question);
    newEvent.eventTimeUnix = Date.parse(req.body.eventTime);
    newEvent.eventTimeString = req.body.eventTime;
    newEvent.save(function (err, newevent) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'server error'});
      }
      res.json(newevent);
    });
  });

  router.post('/events', eatAuth, function(req, res) {
    var parsedUrl = url.parse(req.url, true);
    var questionIds = parsedUrl.query.questionIds.split(';');
    var predictions = parsedUrl.query.predictions.split(';');
    var eventId = parsedUrl.query.eventId;
    var newVote = new Vote();

    questionIds.forEach(function(val, index) {
       newVote.userId = req.user.uuid;
       newVote.eventId = eventId
       newVote.questionId = val;
       newVote.prediction = predictions[index];

      newVote.save(function(err, vote) {
        if(err){
          console.log(err);
          return res.status(500).json({msg: 'server error'});
        }
        res.status(200).json(vote);
      });
    });
    var eventSummary = Vote.find({'eventId': eventId})
    res.json(eventSummary);
  });


//GET ROUTES

  router.get('/events', function (req, res) {
    var now = Date.now();
    var dayOut = Date.now() + 86400000;

    Event.find({eventTimeUnix: {$gt: now, $lt: dayOut}}, function (err, data) {
      if (err) {
        console.log(err);
        res.status(500).json({msg: 'server error'});
      }
      res.json(data);
    });
  });

  router.get('/events/:id', function (req, res) {
    Event.find({'_id': req.params.id}, function(err, data) {
      if(err) {
        console.log(err);
        return res.status(500).json({msg:'internal server error'});
      }
      
      res.status(200).json(data);
    });
  });


//PUT ROUTES

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

};


