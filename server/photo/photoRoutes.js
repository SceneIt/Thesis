var photoController = require('./photoController');
var app = require('../server');

module.exports = function(app){
	app.get('/getClickedPhoto',photoController.getClickedPhoto);
	app.get('/data',photoController.getPhoto);
	app.post('/data',photoController.postPhoto);
  app.post('/data/getPhotoData',photoController.getPhotoData);

}
