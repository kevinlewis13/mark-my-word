var Vote = require('../models/Vote');
var Event = require('../models/Event');
var EventEmitter = require('events').EventEmitter;
var ee = new EventEmitter();

// event tracker is being used to count callbacks to determine when record
// processing is complete
var eventTracker = {
  votesProcessed: 0,
  votesLength: 0,
  eventsStarted: 0,
  eventsComplete: 0
};

module.exports = function(req,res) {
  var result = {};
  result.user = {};
  result.user.username = req.user.username;
  result.user.email = req.user.basic.email;
  // Find all of the users votes by the uuid
  Vote.find({'userId': req.user.uuid}, function(err, votes) {
    if (err) {
      console.log(err);
      res.status(500).json({msg: 'Database error'});
    }
    if (votes.length === 0) {
      return res.status(200).json({msg: 'User has no votes'});
    }

    eventTracker.votesLength = votes.length;
    // create an object to store events in as a property of the result object
    // result.events keys will be the specific events eventId
    result.events = {};

    votes.forEach(function(vote) {

      // if result.events contains this eventId as a key, add the current vote
      // information to the appropriate question. if eventId is not a key we
      // need to find the event in the event collection and build up an object
      // at result.events[eventId] that contians the relevant information
      if (result.events[vote.eventId]) {

        // Add the users prediction and the result
        // to result.events[eventId].questions[questionId]
        var question = result.events[vote.eventId].questions[vote.questionId];
        question.prediction = vote.prediction;
        question.result = vote.result || null;

      } else {

        // find event by the eventId and add an event object to result.events
        ee.emit('start');
        Event.find({'eventId': vote.eventId}, function(err, event) {
          if (err) {
            console.log(err);
            return res.status(500).json({msg: 'database error'})
          }

          // build an event record in our results object
          result.events[vote.eventId] = {};
          var current = result.events[vote.eventId];
          current.home = event.home;
          current.away = event.away;
          current.timeString = event.timeString;
          current.completed = event.completed;

          // current.questions is an object that will hold all questions
          // associated with the event keyed by id.
          current.questions = {};
          event.questions.forEach(function(quest) {
            current.questions[quest._id] = {
              question: quest.question,
              result: quest.result || null
            };

          });

          // add the vote information for prediction and result
          current.questions[vote.questionId].prediction = vote.prediction;
          current.questions[vote.questionId].result = vote.result || null;

          ee.emit('done');
        });
      }

      // emit vote processed event and increment voteProcessed
      ee.emit('vote');

    });

  });
};

ee.on('vote', function() {
  eventTracker.votesProcessed += 1;
  if (eventTracker.votesProcessed === eventTracker.votesLength &&
    eventTracker.eventsStarted === eventTracker.eventsComplete) {
    return res.status(200).json(result);
  }
});

ee.on('start', function() {
  eventTracker.eventsStarted += 1;
});

ee.on('done', function() {
  eventTracker.eventsComplete += 1;
  if (eventTracker.votesProcessed === eventTracker.votesLength &&
    eventTracker.eventsStarted === eventTracker.eventsComplete) {
    return res.status(200).json(result);
  }
});

