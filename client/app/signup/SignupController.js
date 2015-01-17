angular.module('sceneit.signup', ['ngCookies'])

.controller('SignupController', function($scope, $state, $http, $cookies, AuthFactory, $rootScope) {
	$scope.user = {
		username: 'enter a username',
		password: 'enter a password',
		email: 'enter an email'
	}

 	$scope.signup = function(){
 		AuthFactory.signup($scope.user);
 	};
}); 

