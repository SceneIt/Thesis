require('dotenv').load();

var Sequelize = require('sequelize');
var sequelize = new Sequelize('sceneitDB', process.env.DB_USER, process.env.DB_PWD, {
  dialect: 'mysql',
  host: '162.246.58.173'
});


sequelize.authenticate().complete(function(err) {
  if (!!err) {
    console.log(err);
  } else {
    console.log('sequelize authenticated');
  }
});

// Define schemas

// Photo table schema
var Photo = sequelize.define('Photo', {
  latitude: Sequelize.STRING,
  longitude: Sequelize.STRING,
  description: Sequelize.STRING,
  photoUrl: Sequelize.STRING,
  timeStamp: Sequelize.DATE,
  score: Sequelize.INTEGER
});

// Comment table schema
var Comment = sequelize.define('Comment', {
  comment: Sequelize.STRING,
  commentScore: Sequelize.INTEGER,
});

// User table schema
var User = sequelize.define('User', {
  userName: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  rank: Sequelize.INTEGER
});

// Setting foreign keys and relationships
User.hasMany(Comment);
User.hasMany(Photo);
Photo.belongsTo(User);
Comment.belongsTo(User);
Photo.hasMany(Comment);

User.sync();
Photo.sync();
Comment.sync();


exports.sequelize = sequelize;
exports.User = User;
exports.Photo = Photo;
exports.Comment = Comment;
