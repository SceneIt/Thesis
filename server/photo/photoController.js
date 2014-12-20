  var db = require('../models/index.js');
  var scheme = require('./photoModel.js');

  db.client
  .query("INSERT INTO untitled_table(the_geom, name) VALUES(CDB_latlng(43,-120),'test')", function(err,data) {
  	console.log(data);
  	console.log(err);
  })