var CartoDB   = require("cartoDB");
var client    = new CartoDB({
	user: process.env.CARTODB_USER, /*|| 'secenit',*/
	api_key: process.env.CARTODB_API /*|| '0f195be5428ef6691bb4af378123eb237522f8af'*/
});
var db        = {};
db.client = client;
db.CartoDB = CartoDB;



module.exports = db;
