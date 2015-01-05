angular.module('sceneit.signup', ['ngCookies'])

.controller('SignupController', function($scope, $state, $http, $cookies, Auth, $rootScope) {
	$scope.user = {
		username: 'enter a username',
		password: 'enter a password',
		email: 'enter an email'
	}

	$scope.user = Auth.userInfo;

 	$scope.signup = function(){
 		Auth.signup(Auth.userInfo);
 	};
}); 

