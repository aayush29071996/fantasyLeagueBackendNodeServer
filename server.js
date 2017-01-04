var express = require('express');
var app = express();
var server = require('http').Server(app);
var bodyParser = require('body-parser');
var cors = require('cors');
var morgan = require('morgan');
var path = require('path');

var port = process.env.PORT || 9000;

app.use(cors({origin:'http://localhost:' + port}));
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

require("./server/routes.js")(app);

server.listen(port);
console.log('App is listening on port: ' + port);
