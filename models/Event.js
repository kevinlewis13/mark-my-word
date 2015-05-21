'use strict';

var mongoose = require('mongoose');
var Vote = require('./Vote');

var eventSchema = new mongoose.Schema({
  eventId: String,
  home: String,
  away: String,
  eventTimeUnix: Number,
  eventTimeString:String,
  completed: Boolean,
  questions:[
    {
      question: String,
      result: Boolean
    }
  ],
  users: []
});

eventSchema.method.findUsers = function() {
 Vote.find({eventId : this.eventId}, function(err, votes) {
    votes.forEach(function(vote) {
      if (this.users.indexof(vote.userId) === -1) {
        this.users.push(vote.userId);
      };
    });
  });
};

module.exports = mongoose.model('Event', eventSchema);


