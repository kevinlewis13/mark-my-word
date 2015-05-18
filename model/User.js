'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var uuid = require('uuid');
var eat = require('eat');


var eventSchema = new mongoose.Schema({
	username: String,
	basic:{
		email: {type: String, unique: true, required: true},
		password:{type: String, unique:true, required: true}
	}
	location: String,
	wins: Number,
	losses: Number,
	bets: Number,
	record: this.wins/this.bets,
	tokenId: String,
	events: []
});





