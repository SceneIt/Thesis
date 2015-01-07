var bodyParser = require('body-parser');
var helpers = require('./helpers'); // our custom middleware
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

	app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(allowCrossDomain);
  app.use('/api/photo',photoRouter);

  require('../photo/photoRoutes')(photoRouter);

  //Creates new user route
  var userRouter = express.Router();
  app.use(morgan('dev')); //Console log POST and GET status

  app.use(express.static(__dirname + '/../../client'))

 //required for passport --session secret
  app.use(session({secret: 'mySecretKey', saveUninitialized: true, resave: false}));
  app.use(passport.initialize());
  app.use(passport.session()); //persistent login session

  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);

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


  app.post('/api/signup', passport.authenticate('local-signup'),  function(req, res, next){
    if(req.isAuthenticated()){
      console.log('Signup success');
      res.cookie('user', req.body.username, { httpOnly: false } );
      res.status(200).send({username: req.body.username});
      next();
    } else{
      console.log('Should send 403')
      res.sendStatus(403);
      next();
    }
  });

  app.post('/api/signin', passport.authenticate('local-signin'), function(req, res, next){
   if(req.isAuthenticated()){
      console.log('Signin success');
      res.cookie('user', req.body.username, { httpOnly: false } );
      res.status(200).send({username: req.body.username});
      next();
    } else{
      res.sendStatus(401);
      next();
    }
  });

  app.post('/api/logout', function(req, res, next){
      req.logout();  
      res.clearCookie('user');
      delete req.session.user;
      req.session.authenticated = false;
      res.clearCookie('connect.sid');
      res.sendStatus(200);
      console.log('Logout success');
  });

	app.get('*', function(req, res) {
		if(!req.isAuthenticated()){
			res.sendStatus(401); // load our public/index.html file
		}
	});

  passport.use('local-signup', new LocalStrategy({
    passReqToCallback : true
	  },
    function(req,username, password, done){
      db.User.find({
        where: {
          userName: username
        }
    }).then(function(user){
      if(!user){
        addUser(req.body.username, req.body.password, req.body.email);
        userDB = {username: req.body.username};
        return done(null, userDB);//{username: req.body.username, password: req.body.password});
      }

      if(user){
        console.log('User Already Exists');
        return done(null, false);
      }
    }).catch(function(err){
	    
    })}
  ));

	passport.use('local-signin', new LocalStrategy({
	  passReqToCallback: true
	},
	function(req, username, password, done){
		db.User.find({
		  where: {
		    userName: username
		  }
		}).then(function(user){
			if(!user){
			  console.log('User Does Not Exist');
			}
			if(user){
			  if(bcrypt.compareSync(password, user.dataValues.password)){

			    var userDB = {username: user.dataValues.userName}
			    return done(null, userDB);
			  }

			  if(!bcrypt.compareSync(password, user.dataValues.password)){
			    console.log('badpass');
			    return done(null, false);
			  }
			}
		}).catch(function(err){
			console.error(err);
		})
	}));


	//Adds user reg info to database
	var addUser = function(username, password, email){
	  db.User.create({
	    userName: username,
	    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
	    email: email
	  });
	}

	var auth = function(req, res, next){ 
	  if (!req.isAuthenticated()){	
	    res.sendStatus(401); 
	  }
	  else {
	  	next();
		} 
	}; 
};






