'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var uuid = require('uuid');
var eat = require('eat');


var eventSchema = new mongoose.Schema({
	name: String,
	location: String,
	startDate: Number,
	expDate: Number
	bets: {
		win: boolean,
		lose: boolean,
		random; boolean,
		random2; boolean,
		random3; boolean
	}
	users: [],
	id: String
});

