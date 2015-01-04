var app = require('../server');
var fs = require('fs');
var Busboy = require('busboy');
var path = require('path');
var photoStore = path.resolve('client/photoStore');
var photoController = require('./photoController');
var q = require('q');
var bodyParser = require('body-parser');
var comment;

module.exports = function(app){

  // Responds to POST requests to /photo/take
  app.post('/take', function(req,res){
    console.log('POST - reading file directory');
    // If this post request is the comment and not the image, save the comment and return
    if(req.body.desc){
      comment = req.body.desc.comment;
      return;
    }
    //TODO: add append userID to photostore, make directory if it doesn't exist

    // Grabbing the last (largest) filename/number in the user directory, 
    //  strips extension before saving as a number
    var filenumber = Number(fs.readdirSync(photoStore).sort(function(a,b){
      return a.replace(/\.[^.]*$/,'')-b.replace(/\.[^.]*$/,'');
    }).pop().replace(/.jpg/,''));

    //If no pictures exist for user, start at 0 (then increment, so actually start at 1)
    //  if already exists, just increment number
    if(isNaN(filenumber)){
      filenumber = 0;
    }
    filenumber++;


    var saveTo = path.join(photoStore, filenumber+'.jpg');
    var busboy = new Busboy({ headers: req.headers });

    // busboy concats multi-part streams for images sent from app
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      file.pipe(fs.createWriteStream(saveTo));
    });
    busboy.on('finish', function() {
      res.writeHead(200, { 'Connection': 'close' });
      console.log('done and done');
      res.end("That's all folks!");

      //grabs EXIF data, parses
      //TODO: move to helpers file
      photoController.getExif(saveTo, comment);
    });
    return req.pipe(busboy);
  });

};
