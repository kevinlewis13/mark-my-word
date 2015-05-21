'use strict';

var mongoose = require('mongoose');
var Vote = require('./Vote');
var EventEmitter = require('events').EventEmitter;
var ee = new EventEmitter();

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

eventSchema.methods.findUsers = function(callback) {
  var that = this;
  Vote.find({eventId: this._id}, function(err, votes) {
    votes.forEach(function(vote) {
      if(that.users.indexOf(vote.userId) === -1) {
        that.users.push(vote.userId);
        that.save(function(err){
          if (err) {console.log(err);}
        });
      }
    callback(err);
    });
  });
};

module.exports = mongoose.model('Event', eventSchema);
