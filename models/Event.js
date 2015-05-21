'use strict';

var mongoose = require('mongoose');

var eventSchema = new mongoose.Schema({
  eventId: String,
  home: String,
  away: String,
  eventTimeUnix: Number,
  eventTimeString:String,
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
        this.users.push(vote.userId)
    });
  });
}

module.exports = mongoose.model('Event', eventSchema);

 