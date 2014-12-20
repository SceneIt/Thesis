var express        = require('express');
var bodyParser     = require('body-parser');

var app = express();

app.use(express.static(__dirname + '/../client'))

var port = process.env.PORT || 8000;
app.set('port', port);

app.listen(app.get('port'), function(){
  console.log("Applet listening on port " + port);
});

