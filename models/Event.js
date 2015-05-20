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
  ]
});

module.exports = mongoose.model('Event', eventSchema);

 