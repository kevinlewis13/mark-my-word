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
    var newVote = new Vote();

    var EventEmitter = require('events').EventEmitter;
    var ee = new EventEmitter();

    var count = 0;
    ee.on('save', function() {
      if (count === questionIds.length) {
        res.json({msg: 'done'});
      }
    });

    questionIds.forEach(function(val, index) {
      newVote.userId = req.user.uuid;
      newVote.eventId = parsedUrl.query.eventId;
      newVote.questionId = val;
      newVote.prediction = predictions[index];
      newVote.save(function(err, vote) {
        if (err) {
          console.log(err);
          return res.status(500).json({msg: 'server error'});
        }
        count += 1;
        ee.emit('save');
      });
    });

    // questionIds.forEach(function(val, index) {
    //   newVote.userId = req.user.uuid;
    //   newVote.eventId = parsedUrl.query.eventId;
    //   newVote.questionId = val;
    //   newVote.prediction = predictions[index];
    //   var count = 0;
      
    //   newVote.save(function(err, vote) {
    //     if(err){
    //       console.log(err);
    //       return res.status(500).json({msg: 'server error'});
    //     }
    //     counter ++;
    //   });

    //   if(counter === questionIds.length -1) {
    //     res.json({msg: 'done'})
    //   }

    // });


    // for(var i = 0; i < questionIds.length; i++) {

    //   (function(lockedIndex) {
    //     newVote.userId = req.user.uuid;
    //   newVote.eventId = parsedUrl.query.eventId;
    //   newVote.questionId = questionIds[i];
    //   newVote.prediction = predictions[i];

    //   newVote.save(function(err, vote) {
    //     if(err){
    //       console.log(err);
    //       return res.status(500).json({msg: 'server error'});
    //     }
    //   });
    // })(i);
      
    // }




    res.json({msg: 'done'})

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


// questionIds.forEach(function(index, val) {
//       newVote.userId = req.user.uuid;
//       newVote.eventId = parsedUrl.query.eventId;
//       newVote.questionId = val;
//       newVote.prediction = predictions[index];

//       newVote.save(function(err, vote) {
//         if(err){
//           console.log(err);
//           return res.status(500).json({msg: 'server error'});
//         }
//         res.status(200).json(vote);
//       });
//     });

    // for(var i = 0; i < questionIds.length; i++) {
    //   newVote.userId = req.user.uuid;
    //   newVote.eventId = parsedUrl.query.eventId;
    //   newVote.questionId = questionIds[i];
    //   newVote.prediction = predictions[i];

    //   newVote.save(function(err, vote) {
    //     if(err){
    //       console.log(err);
    //       return res.status(500).json({msg: 'server error'});
    //     }
    //     res.status(200).json(vote);
    //   });
    // }