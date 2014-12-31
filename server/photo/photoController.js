  var db = require('../DB/db.js');

  module.exports = {
  	getPhoto: function(req,res){
      //grabs all photo entries and stores them in an array
      db.Photo.findAll().then(function(photos){
        //console.log(photos);
        res.send(photos);
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
      })
    }
  }

