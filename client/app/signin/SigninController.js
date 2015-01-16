angular.module('sceneit.signin', [])

.controller('SigninController', function($scope, Auth) {
  $scope.user = {
    username: 'username',
    password: 'password'
  };

  $scope.signin = function(){
    Auth.signin($scope.user);
  };
})
