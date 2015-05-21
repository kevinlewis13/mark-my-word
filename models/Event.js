'use strict';

var mongoose = require('mongoose');
var Vote = require('./Vote');

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

eventSchema.methods.findUsers = function() {
  Vote.find({eventId : this.eventId}, function(err, votes) {  
    votes.forEach(function(vote) {
      if(this.users.indexOf(vote.userId) === -1) {
        this.users.push(vote.userId)
      }
    });
  });
}

module.exports = mongoose.model('Event', eventSchema);

 