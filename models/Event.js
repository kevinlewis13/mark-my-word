'use strict';

var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({
  eventId: String,
  eventName: String,
  eventTimeUnix: Number,
  eventTimeString:String,
  location: String,
  questions:[
        {
        question: String,
        yes: [String],
        no: [String],
        actual: Boolean 
    }
  ],
  count: Number
});

eventSchema.methods.void = function(date) {
  return date > this.eventTime;
};

module.exports = mongoose.model('Event', eventSchema);

 