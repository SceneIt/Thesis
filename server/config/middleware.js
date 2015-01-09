var bodyParser = require('body-parser');
var utils = require('./utils'); // our custom middleware
var passport   = require('passport');
var session    = require('express-session');
var morgan     = require('morgan');
var bcrypt = require('bcrypt-nodejs');
var LocalStrategy = require('passport-local').Strategy;
var db = require('../DB/db')

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

module.exports = function(app, express) {
	var photoRouter = express.Router();
	var commentRouter = express.Router();

	app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(allowCrossDomain);
  app.use('/api/photo',photoRouter);
  app.use('/photo', photoRouter);
  app.use('/api/comments',commentRouter);

  require('../photo/photoRoutes')(photoRouter);
  require('../photo/takePhoto')(photoRouter);
  require('../comment/commentRoutes')(commentRouter);


  //Creates new user route
  app.use(morgan('dev')); //Console log POST and GET status

  app.use(express.static(__dirname + '/../../client'))

 //required for passport --session secret
  app.use(session({secret: 'mySecretKey', saveUninitialized: true, resave: false}));
  app.use(passport.initialize());
  app.use(passport.session()); //persistent login session

  app.use(utils.errorLogger);
  app.use(utils.errorHandler);

  passport.serializeUser(function(user, done) {
    console.log('Serialized');
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    console.log('Deserialized');
    db.User.find({
      where:{
        userName: user.username
      }
    }).then(function(user){
      done(null, user);
    }).catch(function(err){
      done(err, null);
    });
  });


  var userRouter = express.Router();
  app.use('/api/user', userRouter);
  require('../user/userRoutes')(userRouter, passport);

  passport.use('local-signup', new LocalStrategy({
    passReqToCallback : true },
    utils.passportSignUp
    ));

	passport.use('local-signin', new LocalStrategy({
	  passReqToCallback: true },
    utils.passportSignIn
  ));

};


