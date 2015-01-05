angular.module('sceneit.signin', [])

.controller('SigninController', function($scope, Auth) {
  $scope.user = {
    username: 'username',
    password: 'password'
  };

  Auth.userInfo = $scope.user;

  $scope.signin = function(){
    Auth.signin(Auth.userInfo);
  };
})
