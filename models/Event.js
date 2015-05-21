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

eventSchema.method.findUsers = function(array) {
  var that = this;
  Vote.find({eventId : this.id}, function(err, votes) {
    votes.forEach(function(vote) {
      if (array.indexOf(vote.userId) === -1) {
        array.push(vote.userId);
      };
    });
  });
};

module.exports = mongoose.model('Event', eventSchema);


