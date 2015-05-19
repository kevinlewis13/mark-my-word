'use strict';

var Event = require('../models/Event');
var bodyParser = require('body-parser');
var url = require('url');
var eatAuth = require('../lib/eat_auth')(process.env.APP_SECRET);



module.exports = function (router) {
  router.use(bodyParser.json());

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

  router.post('/events/:id', eatAuth, function(req, res) {
    var testUrl = '/events?user_Token=RRBIa+sFhwohzXYogd6iWFYsR2lGbyta5TyaZ13Rz5fWwCISdwrw6kaYDYoHdoFCv7GciV5zcWP5QcNzWCDlj4MEPkqKgps=&eventId=555b9d78d5d15203008e1e4c&q1=true&q2=false&q3=false'
    var parsedUrl = url.parse(testUrl, true);

    Event.update({'_id': req.params.id},{$addToSet:{questions: update}}, function(err, data) {
      if(err){
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }
      res.json({msg: "Post Update: Nailed it"});
    });
    User.update({'uuid': req.user.uuid})
  });
};

 // query:
 //   { user_Token: 'RRBIa sFhwohzXYogd6iWFYsR2lGbyta5TyaZ13Rz5fWwCISdwrw6kaYDYoHdoFCv7GciV5zcWP5QcNzWCDlj4MEPkqKgps=',
 //     eventId: '555b9d78d5d15203008e1e4c',
 //     q1: 'true',
 //     q2: 'false',
 //     q3: 'false' },
