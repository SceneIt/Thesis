var Sequelize = require('sequelize');
require('dotenv').load();
var sequelize = new Sequelize('sceneitDB',process.env.DB_USER, process.env.DB_PWD,
	{
		dialect:'mysql', host:'162.246.58.173'
	});
//define schema
sequelize.authenticate().complete(function(err){
if(!!err){
		console.log(err);
	} else {
		console.log('sequelize authenticated');
	}
})
var Photo = sequelize.define('Photo',{
	latitude: Sequelize.STRING, 
	longitude: Sequelize.STRING, 
	description: Sequelize.STRING, 
	photoUrl: Sequelize.STRING, 
	timeStamp: Sequelize.DATE, 
	score: Sequelize.INTEGER
});
//comment table schema
var Comment = sequelize.define('Comment',{
	comment: Sequelize.STRING,
	commentScore: Sequelize.INTEGER,
});
//user table schema
var User = sequelize.define('User', {
	userName: Sequelize.STRING,
	email: Sequelize.STRING,
	password: Sequelize.STRING,
	rank: Sequelize.INTEGER
});

//setting foreign keys (relationships)
User.hasMany(Comment);
Photo.hasMany(Comment);
Photo.hasOne(User);
User.hasMany(Photo);

User.sync();
Photo.sync();
Comment.sync();


exports.sequelize = sequelize;
exports.User = User;
exports.Photo = Photo;
exports.Comment = Comment;


