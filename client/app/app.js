angular.module('sceneit', [
	'ui.router',
	'sceneit.home',
	'sceneit.map'
])

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

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
});
