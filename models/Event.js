'use strict';

var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({
  eventId: String,
  eventName: String,
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

 