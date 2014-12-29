  var db = require('../models/index.js');
  var scheme = require('./photoModel.js');

  module.exports = {
  	getPhoto: function(req,res){
      console.log('yays');
  		db.client
  			.query("SELECT * FROM {table}", {table: 'untitled_table'}, function(err,data){
  				if(err){
  					console.log(err);
  				} else {
  					console.log(data);
  					res.status(200).json(data);
  				}
  		})
  	}
  }
  //code to insert data into table from cartoDB.
  // db.client
  // .query("INSERT INTO untitled_table(the_geom, name) VALUES(CDB_latlng(43,-120),'test')", function(err,data) {
  // 	console.log(data);
  // 	console.log(err);
  // })