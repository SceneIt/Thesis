angular.module('sceneit.factories', ['ngCookies'])

.factory('Auth', function($state, $http, $window, $cookies){

  var isAuthenticated = function(){
    if($cookies['userID']){
      return true;
    }
    return false;
  };

  var signup = function(user){
    return $http({
      method: 'POST',
      url: '/api/user/signup',
      data: user
    }).then(function(res){
      console.log(res);
      if(isAuthenticated()){
        $state.go('home');
      }
    });
  };

  var signin = function(user){
    return $http({
      method: 'POST',
      url: '/api/user/signin',
      data: user
    }).then(function(res){
      console.log(res);

      $state.go('home');
    });
  };

  var signout = function(){
    return $http({
      method: 'POST',
      url: '/api/user/logout'
    }).then(function(res){
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
