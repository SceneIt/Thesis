  var db = require('../DB/db.js');
  var scheme = require('./photoModel.js');

  module.exports = {
  	// getPhoto: function(req,res){
  	// 	db.client
  	// 		.query("SELECT * FROM {table}", {table: 'untitled_table'}, function(err,data){
  	// 			if(err){
  	// 				console.log(err);
  	// 			} else {
  	// 				console.log(data);
  	// 				res.status(200).json(data);
  	// 			}
  	// 	})
  	// },
   //  uploadPhoto: function(req,res){}
  }
  //code to insert data into table from cartoDB.
  // db.client
  // .query("INSERT INTO untitled_table(the_geom, name) VALUES(CDB_latlng(43,-120),'test')", function(err,data) {
  // 	console.log(data);
  // 	console.log(err);
  // })