angular.module('sceneIt.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('CameraCtrl', function($scope) {
  
})

.controller('GeoLocCtrl', function($scope, $q){
  $scope.geoloc = {};

  var location = function($q){
    return $q(navigator.geolocation.getCurrentPosition( function(success){
      console.log('success', success.coords);
      $scope.geoloc.coords = success.coords;
    }));
  };

  $scope.getLocation = function(){
    location()
      .then( function(data){
        console.log('loading map..', data);
        var mapOptions = {
         center: new google.maps.LatLng($scope.geoloc.lat, $scope.geoloc.lng),
          zoom: 8
        };
        var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
        $scope.map = map;
      });
  };
    // google.maps.event.addDomListener(window, 'load', initialize);

});
