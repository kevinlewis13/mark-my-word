'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({
	username: {type: String, required:{'Username required'}, unique:{'Username already in use'}, trim:true},
	basic:{
		email: {type: String, required: {'Email field required'}, unique:{'Email already in use'}},
		password:{type: String, required: {'Password required'}}
	},
	city: String,
	state: String,
	wins: Number,
	losses: Number,
	bets: Number,
	record: Number,
	tokenId: String,
	events: []
});

userSchema.methods.generateId = function() {
	this.tokenId = Date.now();
}

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
