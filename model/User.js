'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var uuid = require('uuid');
var eat = require('eat');


var userSchema = new mongoose.Schema({
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


userSchema.methods.generateHash = function(password, callback) {
	bcrypt.genSalt(8, function(err, salt) {
		bcrypt.hash(password, salt, null, function(err, hash) {
			if(err) {
				console.log(err);
			}
			callback(err, hash);
		});
	});
};

userSchema.methods.checkPassword = function(password, callback) {
	bcrypt.compare(password, this.basic.password, function(err, res) {
		if(err) {
			console.log(err);
		}
		callback(err, res);
	});
}



