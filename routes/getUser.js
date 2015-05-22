var Vote = require('../models/Vote');
var Event = require('../models/Event');
var EventEmitter = require('events').EventEmitter;
var ee = new EventEmitter();

module.exports = function(req, res) {

  var count = 0;
  var length = 0;

  var result = {
    user: {
      username: req.user.username,
      email: req.user.basic.email
    }
  };

  ee.on('complete', function() {
    res.status(200).json(result);
  });

  Vote.find({'userId': req.user.uuid}, function(err, votes) {
    if (votes.length === 0) {
      res.status(200).json({msg: 'user has no votes'});
    }
    // votes contains an array of vote documents
    result.votes = votes;
    var eventIds = [];
    votes.forEach(function(vote) {
      if(eventIds.indexOf(vote.eventId) === -1) {
        eventIds.push(vote.eventId);
      }
    });

    length = eventIds.length;
    result.events = [];
    eventIds.forEach(function(id) {
      Event.findOne({'_id': id}, function(err, data) {
        if (err) {
          console.log(err);
          res.status(500).json({msg: 'Database error'});
        }
        result.events.push(data);

        count += 1;
        if (count === length) {
          ee.emit('complete');
        }
      });
    });

  });

};



