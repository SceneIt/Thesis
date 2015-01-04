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
      console.log('code: '    + error.code    + '\n' +
            'message: ' + error.message + '\n');
  }

  // Options: throw an error if no update is received every 30 seconds.
  //
  var watchID = navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 30000 });
})

.controller('cameraCtrl', function($http, $scope, $cordovaProgress, $timeout, $cordovaFile) {
  $scope.data = '_';
  var cameraOptions = {
    quality: 80,
    // destinationType: Camera.DestinationType.NATIVE_URI,
    encodingType: Camera.EncodingType.JPEG,
    saveToPhotoAlbum: true,
    targetWidth: 720,
    targetHeight: 720
    // allowEdit: true
  }

  $scope.takePicture = function(){
    cameraOptions.sourceType = Camera.PictureSourceType.CAMERA;
    cameraOptions.destinationType = Camera.DestinationType.FILE_URI;
    $scope.grabPicture();
  }
  $scope.selectPicture = function(){
    cameraOptions.sourceType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
    cameraOptions.destinationType = Camera.DestinationType.NATIVE_URI;
    $scope.grabPicture();
  }
  $scope.grabPicture = function(){
    navigator.camera.getPicture(function(imageURI) {
      var image = document.getElementById('myImage');
          image.src = imageURI;
          $scope.data = imageURI;
      // imageURI is the URL of the image that we can use for
      // an <img> element or backgroundImage.
      console.log('camera success');
      $scope.data = 'success';
      var image = document.getElementById('preview');
      $scope.imageData = imageURI;
      image.src = $scope.imageData;
    }, function(err) {
      $scope.data = 'fail';
      console.log('camera error');

    }, cameraOptions);
  }

  $scope.description = {};
  $scope.description.comment = '';

  $scope.uploadPicture = function(){
    var server = encodeURI('http://10.6.32.229:8000/photo/take');
    var req = {
     method: 'POST',
     url: 'http://10.6.32.229:8000/photo/take',
     headers: {
       'Content-Type': 'application/json'
     },
     data: {desc: $scope.description}
    }
    // if($scope.description){
      $http(req).success(function(){
        alert('successful comment send');
      });
    // }
    var win = function (r) {
      $cordovaProgress.showSuccess(true, "Success!");
      $timeout($cordovaProgress.hide, 2000);
    }

    var fail = function (error) {
        alert('upload Fail');
    }

    var options = new FileUploadOptions();
    options.mimeType = "image/JPEG";

    var ft = new FileTransfer();
    ft.upload($scope.imageData, server, win, fail, options);
  };
});
