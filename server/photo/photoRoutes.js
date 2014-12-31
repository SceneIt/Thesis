var photoController = require('./photoController');
var app = require('../server');

module.exports = function(app){
	app.get('/data',photoController.getPhoto);
	app.post('/data',photoController.postPhoto);
}