angular.module('sceneit.signin', [])

.controller('SigninController', function($scope, Auth) {
  $scope.user = {
    username: 'username',
    password: 'password'
  };

   $scope.user =  Auth.userInfo;

  $scope.signin = function(){
    Auth.signin(Auth.userInfo);
  };
})
