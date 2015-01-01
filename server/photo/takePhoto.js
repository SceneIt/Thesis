var app = require('../server');
var bodyParser = require('body-parser');
var fs = require('fs');
var Busboy = require('busboy');
var path = require('path');
var filenumber = 0;

module.exports = function(app){
  app.post('/take', function(req,res){
    console.log('POST - taking photo..');
    var busboy = new Busboy({ headers: req.headers });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      filenumber++;
      var saveTo = path.join(__dirname +'/uploads/', path.basename(fieldname)+filenumber+'.jpg');
      console.log(fieldname, saveTo, filename);
      file.pipe(fs.createWriteStream(saveTo));
    });
    busboy.on('finish', function() {
      res.writeHead(200, { 'Connection': 'close' });
      console.log('done and done');
      res.end("That's all folks!");

    });
    return req.pipe(busboy);
  });

  app.get('/take', function(req,res){
    console.log('GET - taking photo..');
    res.sendStatus(200);
  });
};
