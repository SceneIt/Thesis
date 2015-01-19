angular.module('sceneit', [
  'ui.router',
  'sceneit.home',
  'sceneit.map',
  'sceneit.signin',
  'sceneit.signup',
  'sceneit.factories'
])

//Defines routes for Mappix app
.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise('/home');

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'app/home/home.html',
      controller: 'HomeController'
    });

  $stateProvider
    .state('map', {
      url: '/map',
      templateUrl: 'app/map/map.html',
      controller: 'MapController'
    });

  $stateProvider
    .state('signin', {
      url: '/signin',
      templateUrl: 'app/signin/signin.html',
      controller: 'SigninController'
    });

  $stateProvider
    .state('signup', {
      url: '/signup',
      templateUrl: 'app/signup/signup.html',
      controller: 'SignupController'
    });
});
