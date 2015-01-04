var db = require('../DB/db.js');
var fs = require('fs');
var ExifImage = require('exif').ExifImage;
var q = require('q');
var path = require('path');
  module.exports = {
  	getPhoto: function(req,res){
      //grabs all photo entries and stores them in an array
      db.Photo.findAll().then(function(photos){
        //console.log(photos);
        res.send(photos);
      });
  	},
    //adds photo to database ~ req comes in as JSON
    postPhoto: function(req,res){
      var newPhoto = req.body;
      db.Photo.create({
        latitude: newPhoto.latitude, 
        longitude: newPhoto.longitude, 
        description: newPhoto.description, 
        photoUrl: newPhoto.photoUrl, 
        timeStamp: new Date(),
        score:0
      })
      .success(function(data){
        res.json(data.values);
        //console.log(data.values);
      });
    },
    // sub routine to convert DMS lat/long to decimal 
    convertDMSToDD: function(degrees, minutes, seconds, direction) {
      var dd = degrees + minutes/60 + seconds/(60*60);
      if (direction == "S" || direction == "W") {
          dd = dd * -1;
      } // Don't do anything for N or E
      return dd;
    },
    getExif: function(saveTo, comment) {
      var that = this;
      var data;
      new ExifImage({ image : saveTo }, 
        function (error, exifData) {
          if (error)
            console.log('Error: '+error.message);
          else {
            // save exif data and comment to DB
            console.log()
            db.Photo.create({
              latitude: that.convertDMSToDD(exifData.gps.GPSLatitude[0], exifData.gps.GPSLatitude[1], exifData.gps.GPSLatitude[2], exifData.gps.GPSLatitudeRef),
              longitude: that.convertDMSToDD(exifData.gps.GPSLongitude[0], exifData.gps.GPSLongitude[1], exifData.gps.GPSLongitude[2], exifData.gps.GPSLongitudeRef),
              photoUrl: path.join('/photoStore/' + path.basename(saveTo)),
              timeStamp: new Date(),
              description: comment, 
              score:0
            })
          }
      });
      return data;
    }

  }



