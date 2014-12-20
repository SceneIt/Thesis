 angular.module('sceneit.factories', ['ngCookies'])

.factory('Home', function($http) {
	var search = function() {
	}

	return {
		search:search
	}
})

.factory('Session', function(){
  var _username = null;

  var setUsername = function(usernameIN){
    _username = usernameIN;
    return _username;
  };

  var username = function(){
    return _username;
  }

  var create = function(usernameCreate){
    _username = usernameCreate;
  };

  var destroy = function(){
    _username = null;
  }

  return {
    create: create,
    setUsername: setUsername,
    destroy: destroy,
    username: username,
    _username: _username
  }
})

.factory('Auth', function($state, $rootScope, $http, $window, $location, $cookies, Session){
  var userInfo = {
    username: 'username',
    password: 'password',
    email: 'email'
  };

  //Keep state when refreshed
  function init() {
		if ($cookies["user"]) {
			Session.create($cookies.user);
		}
	}
  init();

  var isAuthenticated = function(){
    return !!Session.username();
  };

  var signup = function(user){
    $http({
      method: 'POST',
      url: '/api/signup',
      data: userInfo
    })
    .then(function(res){
      Session.create(res.data.username);
      $state.go('home');
    });
  };

  var signin = function(){
    return ($http({
      method: 'POST',
      url: '/api/signin',
      data: userInfo
    })
    .then(function(res){
      Session.create(res.data.username);
      $state.go('home');
    }))
  };

  var signout = function(){
    $http({
      method: 'POST',
      url: '/api/logout'
    }).
    then(function(res){
    var userInfo = {
      username: 'username',
      password: 'password',
      email: 'email'
    }   
	    $rootScope.username = null;
	    Session.destroy();   
      $location.path('/signin');
    }
  );};

  return {
    userInfo: userInfo,
    signin: signin,
    signup: signup,
    signout: signout,
    isAuthenticated: isAuthenticated, 

  }
});

