var app = require('./server/server');

var port = process.env.PORT || 8000;
app.set('port', port);

app.listen(app.get('port'), function(){
  console.log("Server listening on port " + port);
});
