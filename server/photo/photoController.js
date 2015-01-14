var db = require('../DB/db.js');
var fs = require('fs');
var ExifImage = require('exif').ExifImage;
var path = require('path');
var rootUrl = encodeURI('http://corruptflamingo-staging.azurewebsites.net/photoStore/');

  module.exports = {
  	getPhoto: function(req,res){
      //grabs all photo entries and stores them in an array
      db.Photo.findAll({include: [{ model: db.User, attributes: ['id','userName']}]}).then(function(photos){
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.send(photos);
      });
  	},
    getPhotoData: function(req, res){
      var id = req.body.id;
      db.Photo.find({
        where: {id: id}
      }).then(function(data){
        res.send(data);
      })
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
    // sub routine to convert Degrees Minutes and Seconds lat/long to decimal 
    convertDMSToDD: function(degrees, minutes, seconds, direction) {
      var dd = degrees + minutes/60 + seconds/(60*60);
      if (direction == "S" || direction == "W") {
          dd = dd * -1;
      } // Don't do anything for N or E
      return dd;
    },
    getExif: function(saveTo, comment) {
      console.log('extracting EXIF data from image');
      var that = this;
      new ExifImage({ image : saveTo }, 
        function (error, exifData) {
          if (error)
            console.log('Error extracting EXIF data: ' + error.message);
          else {
            // save exif data and comment to DB
            console.log('Writing EXIF data to DB...');
            db.Photo.create({
              latitude: that.convertDMSToDD(exifData.gps.GPSLatitude[0], exifData.gps.GPSLatitude[1], exifData.gps.GPSLatitude[2], exifData.gps.GPSLatitudeRef),
              longitude: that.convertDMSToDD(exifData.gps.GPSLongitude[0], exifData.gps.GPSLongitude[1], exifData.gps.GPSLongitude[2], exifData.gps.GPSLongitudeRef),
              photoUrl: rootUrl + path.basename(saveTo),
              timeStamp: new Date(),
              description: comment,
              score:0
            })
          }
      })
    },

    getClickedPhoto: function(req,res){
      db.Photo.findOne({where:{latitude: req.query.lat, longitude: req.query.lng}}).then(function(photo){
        res.json(photo.id);
      });
    },

    postVotes: function(req, res){
      db.Photo.find({ where: {id: req.body.id}}).on('success', function(photo) {
        if (photo) { // if the record exists in the db
          photo.updateAttributes({
            score: req.body.photoScore
          }).then(function() {
            console.log('success');
          });
        }
      });
    },

    getVotes: function(req, res){
      console.log('req', req.query.id);
      db.Photo.findOne({ where: {id: req.query.id}}).then(function(photo){
        res.json(photo.dataValues.score);

      });
    }
  }

