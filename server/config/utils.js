var app = require('../server');
var db = require('../DB/db');
var bcrypt = require('bcrypt-nodejs');

module.exports = {
  errorLogger: function(error, req, res, next) {
    // log the error then send it to the next middleware in
    // middleware.js

    console.error(error.stack);
    next(error);
  },
  errorHandler: function(error, req, res, next) {
    // send error message to client
    // message for graceful error handling on app
    res.status(500).send({
      error: error.message
    });
    next(error);
  },

  // Signup function - verify user does not exist yet
  // If user does not exist, 
  // hash password,  store username, email, password, and return userdata
  // If user does exist, return a false statement to passport
  passportSignUp: function(req, username, password, done) {
    process.nextTick(function() {
      db.User.find({
        where: {
          userName: username
        }
      }).then(function(user) {

        // Hash password
        var hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);

        if (!user) {
          db.User.create({
            userName: req.body.username,
            password: hashPassword,
            email: req.body.email
          }).then(function(user) {

            // Return username to passport
            var userDB = {
              username: user.dataValues.userName,
              userid: user.dataValues.id
            };
            return done(null, userDB);
          });
        } else {
          // Return to passport and notify user exists 
          console.log('User Already Exists');
          return done(null, false);
        }
      }).catch(function(err) {
        console.log(err);
      });
    });
  },

  // Signup function - verify user and password match database
  // If user exists, verify entered password against database 
  // If user does not exist, return a false statement to passport
  passportSignIn: function(req, username, password, done) {
    console.log('Passport signin');

    // Check is username exists in database
    db.User.find({
      where: {
        userName: username
      }
    }).then(function(user) {
      // User does not exist
      // Notify passport invalid entry
      if (!user) {
        console.log('User Does Not Exist');
        return done(null, false);
      }

      // Validate password
      // Notify passport valid entry
      var passwordValidate = bcrypt.compareSync(password, user.dataValues.password);
      if (passwordValidate) {
        var userDB = {
          username: user.dataValues.userName,
          userid: user.dataValues.id
        }

        return done(null, userDB);
      }

      // Bad password, return and notify passport invalid entry
      console.log('Bad Password');
      return done(null, false);
    }).catch(function(err) {
      console.error(err);
    });
  }
};
