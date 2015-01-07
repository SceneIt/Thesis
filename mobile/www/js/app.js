// Ionic sceneIt App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'sceneIt' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'sceneIt.controllers' is found in controllers.js
angular.module('sceneIt', ['ionic', 'sceneIt.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })
<<<<<<< HEAD:mobile/www/js/app.js

  .state('app.search', {
    url: "/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html"
      }
    }
  })

=======
  // .state('app.comments', {
  //   url: "/comments",
  //   views: {
  //     'menuContent': {
  //       templateUrl: "templates/comments.html"
  //       // controller: 'GeoTestCtrl'
  //     }
  //   }
  // })
  .state('app.camera', {
    url: "/camera",
    views: {
      'menuContent': {
        templateUrl: "templates/camera.html",
        controller: 'cameraCtrl'
      }
    }
  })
  // browse state currently acts as map, this may be renamed later if necessary
>>>>>>> updated client map view, and comments views:SceneItApp/platforms/ios/www/js/app.js
  .state('app.browse', {
    url: "/browse",
    views: {
      'menuContent': {
        templateUrl: "templates/browse.html",
        controller: 'GeoLocCtrl'
      }
    },
    onEnter: function(){
        window.viewingMap = true;
    },
    onExit: function(){
        window.viewingMap = false;
    }
  })

  .state('app.home', {
    url: "/home",
    views: {
      'menuContent': {
        templateUrl: "templates/home.html"
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});

// Cordova Geolocation requires device to be ready
document.addEventListener("deviceready", function(){
  console.log("navigator.geolocation ready");
}, false);
