'use strict';

var express = require('express');
var mongoose = require('mongoose');


var app = express();

var userRoutes = require('./routes/user_routes');

var port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/mmw_dev');

var userRouter = express.Router();

userRoutes(userRouter);

app.use('/', userRouter);

app.listen(port, function() {
  console.log('Server started on ' + port + '.');
});
