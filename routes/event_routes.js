'use strict';

var Event = require('../models/Event');
var User = require('../models/User');
var bodyParser = require('body-parser');
var url = require('url');
var eatAuth = require('../lib/eat_auth')(process.env.APP_SECRET);

module.exports = function (router) {
  router.use(bodyParser.json());

//POST ROUTES

  router.post('/events', function (req, res) {
    var newEvent = new Event(req.body);
    var question = {};
    question.question = req.body.question;
    newEvent.questions.push(question);
    newEvent.eventTimeUnix = Date.parse(req.body.eventTime);
    newEvent.eventTimeString = req.body.eventTime;
    newEvent.save(function (err, data) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'server error'});
      }
      res.json(data);
    });
  });


  router.post('/events/:id', function(req, res) {

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
      console.log(data[0].questions[0]._id);
      res.status(200).json({title: data[0].questions[0].question});
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


