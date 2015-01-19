var userController = require('./userController');
var app = require('../server');

module.exports = function(app, passport) {

	// Authentication routes
  app.post('/signup', passport.authenticate('local-signup'), userController.signIn);
  app.post('/signin', passport.authenticate('local-signin'), userController.signIn);
  app.post('/logout', userController.logOut);
  app.post('*', userController.isAuthenticated);
};
