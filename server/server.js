var express = require('express');
var db = require('./DB/db.js');


var app = express();
app.use(express.static(__dirname + '/../client'))

require('./config/middleware')(app, express);

module.exports = app;
