var commentController = require('./commentController');
var app = require('../server');

module.exports = function(app){
	app.get('/',commentController.getComments);
	app.post('/',commentController.postComment);
}