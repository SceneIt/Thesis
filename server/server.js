var express = require('express');

var app = express();
app.use(express.static(__dirname + '/../client'))


module.exports = app;

require('./config/middleware')(app, express);

