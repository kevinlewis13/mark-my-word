'use strict';

var Event = require('../models/Event');
var User = require('../models/User');
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
      console.log(data[0].questions[0]._id);
      res.status(200).json({title: data[0].questions[0].question});
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
    var parsedUrl = url.parse(req.url, true);
    console.log(req.user.uuid);
    console.log(parsedUrl.query);
    console.log(req.params.id);
    var answersArray = [true, true, true];
    var questionsIdArray = ['555ccffb08f783065057dece', '555cd01808f783065057decf', '555cd01e08f783065057ded0'];

    answersArray.forEach(function(current, index) {
      var yesString = 'questions.' + index + '.yes';
      var noString = 'questions.' + index + '.no';
      var answerYes = {};
      var answerNo = {};
      answerYes[yesString] = req.user.uuid;
      answerNo[noString] = req.user.uuid;

      if (current) {
        //return Event.update({'_id': req.params.id}, { $push: {answerYes: req.user.uuid} }, function(err, data) {
        return Event.update({'_id': req.params.id}, answerYes, function(err, data) {

          if(err){
            console.log(err);
            return res.status(500).json({msg: 'internal server error'});
          }
            console.log(data);
          return console.log('pushed to yes');
        });
      }

      return Event.update({'_id': req.params.id},  answerNo, function(err, data) {
        if(err) {
          console.log(err);
        }

        return console.log('pushed to no');
      });
    });

    User.update({'uuid': req.user.uuid}, {$addToSet:{events: req.params.id}}, function(err, data) {
      if(err){
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }
      res.json(data);
    });
  });
};

 // query:
 //   { user_Token: 'RRBIa sFhwohzXYogd6iWFYsR2lGbyta5TyaZ13Rz5fWwCISdwrw6kaYDYoHdoFCv7GciV5zcWP5QcNzWCDlj4MEPkqKgps=',
 //     eventId: '555b9d78d5d15203008e1e4c',
 //     q1: 'true',
 //     q2: 'false',
 //     q3: 'false' },


    // for (var i = 0; i < answersArray.length; i++) {
    //   var noString = 'questions.' + i + '.no';
    //   var yesString = 'questions.' + i + '.yes';

    //   if (answersArray[i] === true) {

    //     Event.update({'_id': req.params.id}, {$push:{yesString: req.user.uuid}}, function(err, data) {
    //       if(err){
    //         console.log(err);
    //         return res.status(500).json({msg: 'internal server error'});
    //       }
    //       // res.json({msg: "Post Update: Nailed it"});
    //     });
    //  } 

    //   else {

    //     Event.update({'_id': req.params.id}, {$push: {noString: req.user.uuid}}, function(err, data) {
    //       if(err){
    //         console.log(err);
    //         return res.status(500).json({msg: 'internal server error'});
    //       }
    //       // res.json({msg: "Post Update: Nailed it"});
    //     });
    //   }
    // };
