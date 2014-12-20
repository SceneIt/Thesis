var express        = require('express');
var bodyParser     = require('body-parser');
var db		   	 		 = require('./models/index.js');
// var methodOverride = require('method-override');

var app = express();

app.use(express.static(__dirname + '/../client'))

var port = process.env.PORT || 8000;
app.set('port', port);

db.client.on('connect', function() {
	console.log('connected to cartoDB');
});

db.client.connect(); // connects to cartoDB database


app.listen(app.get('port'), function(){
  console.log("Applet listening on port " + port);
});