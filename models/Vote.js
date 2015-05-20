'use strict';

var mongoose = require('mongoose');

var voteSchema = new mongoose.Schema({
  userId: String,
  questionId: String,
  prediction: Boolean,
  result: Boolean
});

module.exports = mongoose.model('Vote', voteSchema);
