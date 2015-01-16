angular.module('sceneit.factories', ['ngCookies'])

.factory('Auth', function($state, $http, $window, $cookies) {

  //User authenticated check
  var isAuthenticated = function() {
    if ($cookies['userID']) {
      return true;
    }
    return false;
  };

  //Signup post to server
  var signup = function(user) {
    return $http({
      method: 'POST',
      url: '/api/user/signup',
      data: user
    }).then(function(res) {
      $state.go('home');
    });
  };

  //Signin post to server
  var signin = function(user) {
    return $http({
      method: 'POST',
      url: '/api/user/signin',
      data: user
    }).then(function(res) {
      $state.go('home');
    });
  };

  // Signout post to server
  var signout = function() {
    return $http({
      method: 'POST',
      url: '/api/user/logout'
    }).then(function(res) {
      $state.go('signin');
    });
  };

  return {
    signin: signin,
    signup: signup,
    signout: signout,
    isAuthenticated: isAuthenticated
  }
});