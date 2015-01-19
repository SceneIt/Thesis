var bodyParser = require('body-parser');
var utils = require('./utils'); // our custom middleware
var passport = require('passport');
var session = require('express-session');
var morgan = require('morgan');
var bcrypt = require('bcrypt-nodejs');
var LocalStrategy = require('passport-local').Strategy;
var db = require('../DB/db')

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};

module.exports = function(app, express) {
  var photoRouter = express.Router();
  var commentRouter = express.Router();
  var userRouter = express.Router();

  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(allowCrossDomain);



  //Logs POST and GET status
  app.use(morgan('dev'));

  app.use(express.static(__dirname + '/../../client'))

  // Required for passport --session secret
  app.use(session({
    secret: 'mySecretKey',
    saveUninitialized: true,
    resave: false
  }));

  // Initialize passport and persistent login session
  app.use(passport.initialize());
  app.use(passport.session());

  // Logs errors
  app.use(utils.errorLogger);
  app.use(utils.errorHandler);


  //Passport middleware
  passport.serializeUser(function(user, done) {
    console.log('Serialized');
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    console.log('Deserialized');
    db.User.find({
      where: {
        userName: user.username
      }
    }).then(function(user) {
      done(null, user);
    }).catch(function(err) {
      done(err, null);
    });
  });


  // Use passport local strategy for signup
  passport.use('local-signup', new LocalStrategy({
      passReqToCallback: true
    },
    utils.passportSignUp
  ));

  // Use passport local strategy for signout 
  passport.use('local-signin', new LocalStrategy({
      passReqToCallback: true
    },
    utils.passportSignIn
  ));

  app.use('/api/photo', photoRouter);
  app.use('/api/comments', commentRouter);
  app.use('/api/user', userRouter);
  app.use('/photo', photoRouter);

  require('../photo/photoRoutes')(photoRouter);
  require('../photo/takePhoto')(photoRouter);
  require('../comment/commentRoutes')(commentRouter);
  require('../user/userRoutes')(userRouter, passport);
};

