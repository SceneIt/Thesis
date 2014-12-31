var express        = require('express');
var bodyParser     = require('body-parser');
<<<<<<< HEAD

var app = express();

app.use(express.static(__dirname + '/../client'))
=======
// var methodOverride = require('method-override');

var app = express();

app.use(express.static(__dirname + '/../client'));
//console.log(__dirname + '/../client');
>>>>>>> c9a3d0eaa0db4228dae6f5e6b0755370917eee43

var port = process.env.PORT || 8000;
app.set('port', port);

app.listen(app.get('port'), function(){
  console.log("Applet listening on port " + port);
});
<<<<<<< HEAD
=======

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

app.use(express.static(__dirname + '/../client'));
app.listen(8000,function() {
	console.log('Listening on 8000');
});
>>>>>>> c9a3d0eaa0db4228dae6f5e6b0755370917eee43
