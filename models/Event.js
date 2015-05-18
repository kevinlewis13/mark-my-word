'use strict';

var mongoose = require('mongoose');

var guessSchema = mongoose.Schema({
  title: String,
  yes: {
    userIds: [String],
    total: Number
  },
  no: {
    userIds: [String],
    total: Number
  }
});

var eventSchema = mongoose.Schema({
  //eventId: String,
  eventName: String,
  eventTime: Date,
  questions:{
        question1:{
        title: String,
        yes: Number,
        no: Number,
        actual: Boolean 
    },
    question2:{
        title: String,
        yes: Number,
        no: Number,
        actual: Boolean 
    }
  },
  bets: [guessSchema]
});

eventSchema.methods.void = function(date) {
  return date > this.eventTime;
};

module.exports = mongoose.model('Event', eventSchema);

    // first: {
    //   yes: {
    //     userIds: [String],
    //     total: Number
    //   },
    //   no: {
    //     userIds: [String],
    //     total: Number
    //   }
    // },
    // second: {
    //   yes: {
    //     userIds: [String],
    //     total: Number
    //   },
    //   no: {
    //     userIds: [String],
    //     total: Number
    //   }
    // },
    // third: {
    //   yes: {
    //     userIds: [String],
    //     total: Number
    //   },
    //   no: {
    //     userIds: [String],
    //     total: Number
    //   }
    // },
    // fourth: {
    //   yes: {
    //     userIds: [String],
    //     total: Number
    //   },
    //   no: {
    //     userIds: [String],
    //     total: Number
    //   }
    // },
    // fifth: {
    //   yes: {
    //     userIds: [String],
    //     total: Number
    //   },
    //   no: {
    //     userIds: [String],
    //     total: Number
    //   }
    // }
