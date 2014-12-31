var CartoDB   = require("cartoDB");
var client    = new CartoDB({
<<<<<<< HEAD
	user: 'secenit',
	api_key: '0f195be5428ef6691bb4af378123eb237522f8af'
=======
	user: process.env.CARTODB_USER, /*|| 'secenit',*/
	api_key: process.env.CARTODB_API /*|| '0f195be5428ef6691bb4af378123eb237522f8af'*/
>>>>>>> staging
});
var db        = {};
db.client = client;
db.CartoDB = CartoDB;



module.exports = db;
