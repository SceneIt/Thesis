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

.controller('GeoLocCtrl', function($scope) {
  // onSuccess Callback
  //   This method accepts a `Position` object, which contains
  //   the current GPS coordinates
  //
  function onSuccess(position) {
      var element = document.getElementById('geolocation');
      element.innerHTML = 'Latitude: '  + position.coords.latitude      + '<br />' +
                          'Longitude: ' + position.coords.longitude     + '<br />' +
                          '<hr />'      + element.innerHTML;
  }

  // onError Callback receives a PositionError object
  //
  function onError(error) {
<<<<<<< HEAD
      alert('code: '    + error.code    + '\n' +
=======
      console.log('code: '    + error.code    + '\n' +
>>>>>>> initial IOS build
            'message: ' + error.message + '\n');
  }

  // Options: throw an error if no update is received every 30 seconds.
  //
  var watchID = navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 30000 });
})
.controller('cameraCtrl', function($scope) {
  var cameraOptions = {
    quality: 50,
    destinationType: Camera.DestinationType.FILE_URI,
    sourceType: Camera.PictureSourceType.CAMERA,
    encodingType: Camera.EncodingType.JPEG,
    allowEdit: true
  }
  $scope.data = '_';
  $scope.takePicture = function(){
    navigator.camera.getPicture(function(imageURI) {
      var image = document.getElementById('myImage');
          image.src = imageURI;
          $scope.data = imageURI;
      // imageURI is the URL of the image that we can use for
      // an <img> element or backgroundImage.
      console.log('camera success');
    }, function(err) {
      $scope.data = 'fail';
      console.log('camera error');

    }, cameraOptions);
  }
});
