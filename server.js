'use strict';

var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');


var app = express();

var strategy = require('./lib/passport_strat');

var userRoutes = require('./routes/user_routes');

var port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/mmw_dev');

var userRouter = express.Router();

app.use(passport.initialize());
strategy(passport);

userRoutes(userRouter);

app.use('/', userRouter, passport);

app.listen(port, function() {
  console.log('Server started on ' + port + '.');
});
