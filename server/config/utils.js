var app = require('../server');
var db = require('../DB/db');
var bcrypt = require('bcrypt-nodejs');

module.exports = {
  errorLogger: function(error, req, res, next) {
    // log the error then send it to the next middleware in
    // middleware.js

    console.error(error.stack);
    next(error);e
  },
  errorHandler: function(error, req, res, next) {
    // send error message to client
    // message for graceful error handling on app
    res.status(500).send({error: error.message });
    next(error);
  },

  passportSignUp: function(req,username, password, done){
    process.nextTick(function(){
      console.log('Passport Signup');
      db.User.find({
          where: {
            userName: username
          }
      }).then(function(user){
        if(!user){
          db.User.create({
            userName: req.body.username,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
            email: req.body.email
          }).then(function(user){
            userDB = {username: req.body.username};
            return done(null, userDB);
          })
        } else{
          console.log('User Already Exists');
          return done(null, false);
        }
      }).catch(function(err){
        console.log(err);
      })
    })
  },

  passportSignIn:   function(req, username, password, done){
    console.log('Passport signin')
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

          var userDB = {username: user.dataValues.userName, userid: user.dataValues.id}
          return done(null, userDB);
        }

        if(!bcrypt.compareSync(password, user.dataValues.password)){
          console.log('Bad Password');
          return done(null, false);
        }
      }
    }).catch(function(err){
      console.error(err);
    })
  }
};