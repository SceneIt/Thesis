var userController = require('./userController');
var app = require('../server');
// var passport = require('passport');

module.exports = function(app, passport){

  app.post('/signup', passport.authenticate('local-signup'), userController.signUp);
  app.post('/signin', passport.authenticate('local-signin'), userController.signIn);
  app.post('/logout', userController.logOut);
  app.post('*', userController.isAuthenticated);
} 


