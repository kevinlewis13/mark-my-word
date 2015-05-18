'use strict';

var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');

var app = express();

var strategy = require('./lib/passport_strat');

var userRoutes = require('./routes/user_routes');
var eventRoutes = require('./routes/event_routes');

var port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/mmw_dev');

var userRouter = express.Router();
var eventRouter = express.Router();

userRoutes(userRouter, passport);
eventRoutes(eventRouter);

app.use(passport.initialize());
strategy(passport);

app.use('/', userRouter);
app.use('/', eventRouter);

app.listen(port, function() {
  console.log('Server started on ' + port + '.');
});
