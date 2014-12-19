var express = require('express');
var bodyParser = require('body-parser');

var app = express();
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

app.use(express.static(__dirname + '/../client'));
app.listen(8000,function() {
	console.log('Listening on 8000');
});