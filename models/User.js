'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var uuid = require('uuid');
var eat = require('eat');

var userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: 'A unique username is required',
		unique: true,
		trim: true
	},
	basic:{
		email: {
			type: String,
			required: 'A unique email address is required',
			unique: true
		},
		password:{
			type: String,
			required: true
		}
	},
	uuid: String,
});

userSchema.methods.generateUuid = function() {
	this.uuid = uuid.v1();
};

userSchema.methods.generateHash = function(password, callback) {
	bcrypt.genSalt(8, function(err, salt) {
		bcrypt.hash(password, salt, null, function(err, hash) {
			if(err) {
				return console.log(err);
			}
			callback(err, hash);
		});
	});
};

userSchema.methods.checkPassword = function(password, callback) {
	bcrypt.compare(password, this.basic.password, function(err, res) {
		if(err) {
			return console.log(err);
		}
		callback(err, res);
	});
};

userSchema.methods.generateToken = function(secret, callback) {
	eat.encode({id: this.uuid, timestamp: Date.now()}, secret,
		function(err, data) {
    	if (err) {
    		return callback(err);
    	}
    	return callback(null, data);
	  });
};

module.exports = mongoose.model('User', userSchema);
