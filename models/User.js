'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({
	username: {type: String, required:true, unique:true, trim:true},
	basic:{
		email: {type: String, required:true, unique:true},
		password:{type: String, required:true}
	},
	tokenId: Number,
	city: String,
	state: String,
	wins: Number,
	losses: Number,
	bets: Number,
	record: Number
	events: []
});

userSchema.methods.generateRecord = function() {
	return this.record = this.wins/this.bets;
};

userSchema.methods.generateTokenId = function() {
	this.tokenId = Date.now();
};

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
};

module.exports = mongoose.model('User', userSchema);
