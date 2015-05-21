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
    var voteArray = [];

    for(var i = 0; i < questionIds.length; i++) {
      var newVote = new Vote();
      newVote.userId = req.user.uuid;
      newVote.eventId = parsedUrl.query.eventId;
      newVote.questionId = questionIds[i];
      newVote.prediction = predictions[i];
      voteArray[i] = newVote;
    }
    
    Vote.create(voteArray, function(err) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'server error'});
      }
      // res.json({msg: 'done'})
    });

    Vote.find({'eventId': parsedUrl.query.eventId}, function(err, data) {
      var result = {};

      data.forEach(function(obj) {
        var yes = 0;
        var no = 0;
        obj.prediction ? yes += 1 : no += 1;
        if (!result[obj.questionId]) {
          result[obj.questionId] = {
            yes: yes,
            no : no,
            total: 1
          };
        } else {
          result[obj.questionId].yes += yes;
          result[obj.questionId].no += no;
          result[obj.questionId].total += 1;
        }  
      });

      res.json(result);
    });

    // Event.find({'_id': parsedUrl.query.eventId}, function(err, data){

    //   var objArr = [];
      
    //   data[0].questions.forEach(function(val){
    //     var newObj = {};
    //     newObj.id = val._id;
    //     objArr.push(newObj);
    //   });

    //   Vote.find('eventId': parsedUrl.query.eventId)


    //   res.json(objArr);
    // }); 

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
