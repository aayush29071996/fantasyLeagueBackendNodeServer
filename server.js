/*
* Created by harirudhra on Sun 1 Jan 2017
*/

// require('newrelic');

var express = require('express');
var app = express();
var server = require('http').Server(app);
var bodyParser = require('body-parser');
var cors = require('cors');
var morgan = require('morgan');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var path = require('path');

var port = process.env.PORT || 9000;

var mongooseUri = 'mongodb://127.0.0.1:27017';
// var mongooseUri = 'mongo db://heroku_5598ll25:egpvjohtsscsnq85friakf1260@ds157278.mlab.com:57278/heroku_5598ll25/';
var connection = mongoose.connect(mongooseUri);
autoIncrement.initialize(connection);

//app.options('*',cors());
app.use(cors({origin: '*'}));
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json({limit: '50mb'}));

require("./server/routes.js")(app);
require("./server/jobs.js")(app);

server.listen(port);
console.log('App is listening on port: ' + port);
