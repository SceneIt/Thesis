angular.module('sceneit.signin', [])

.controller('SigninController', function($scope, AuthFactory) {
  $scope.user = {
    username: 'username',
    password: 'password'
  };

  $scope.signin = function(){
    AuthFactory.signin($scope.user);
  };
})
