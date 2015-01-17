angular.module('sceneit.map', [])

.directive('ngEnter', function() {
  return function(scope, element, attrs) {
    element.bind("keydown keypress", function(event) {
      if (event.which === 13) {
        scope.$apply(function() {
          scope.$eval(attrs.ngEnter, {
            'event': event
          });
        });

        event.preventDefault();
      }
    });
  };
})

.controller('MapController', function($scope, $http, $cookies, $compile, $interval, MapFactory, AuthFactory) {
  angular.extend($scope, AuthFactory);

  $scope.times = ["All", "hour", "day", "week"];
  $scope.mapPoints = [];
  $scope.comment = "";
  $scope.photoId = "";
  
  var photoVotes = {};

  //loads map tiles from custom maps of mapbox
  var layer = L.tileLayer('http://{s}.tiles.mapbox.com/v3/mochicat8.kmifnp9g/{z}/{x}/{y}.png',   {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  });


  //creates leaflet map with given lat / long points with zoom level of 6.
  var map = L.map('map', {
    center: [37.6910, -122.3108],
    zoom: 10,
    zoomControl:false 
  });


  //add base map tiles
  map.addLayer(layer);

  //Creates control parameters for zoom and geosearch
  var zoomControl = L.control.zoom( {position:'topleft'} );
  var searchControl = new L.Control.Geocoder({
    position: 'topleft',
    collapsed: false,
    showResultIcons: false,
  });


  //Renders control icons onto the map
  map.addControl(zoomControl);  
  map.addControl(searchControl);

  map.on('click', function() {
    MapFactory.hideCommentPane();
  })


  // map.locate({setView: true, maxZoom: 10});
  // $interval($scope.initPoints,5000)

  $scope.showPointsAt = function(time) {
    map.removeLayer($scope.copy);
    if (time === "All") {
      $scope.initPoints();
    } else {
      var now = moment();
      var newMarkers = $scope.plotPoints($scope.mapPoints.filter(function(point) {
        return (now.diff(moment(point.timeStamp), time) < 1);
      }));
      addEventListeners(newMarkers);
      map.addLayer(newMarkers);
    }
  }

  var addEventListeners = function(markers) {
    markers.on('click', function(e) {
      // document.querySelector('.commentPane ul').text('');


      // Logs photoID to a local variable and assign to scope
      var photoID = e.layer.options.icon.options.photoID;
      $scope.photoId = photoID;


      // Fetch clicked photo score from database
      MapFactory.getScore(photoID).then(function(photo) {
        $scope.photoScore = photo.data;
      });

      // Set captured thumbsUp and thumbsDown for clicked photo 
      $scope.thumbs = photoVotes[photoID];

      angular.element(document.body.getElementsByClassName('comments')).text('');
      $scope.$apply(function() {

        MapFactory.showCommentPane();

        if (!AuthFactory.isAuthenticated()) {
          angular.element(window.document.body.getElementsByTagName('textarea')).css('display', 'none');
        } else {
          angular.element(window.document.body.getElementsByTagName('textarea')).css('display', 'block');
        }





        MapFactory.getCommentsForPhoto($scope.photoId).then(function(comments) {
          if (comments.data === "null" || comments.data.length === 0) {
            // angular.element(window.document.body.getElementsByTagName('ul')).append('<li> No comments yet. </li>');
          } else {
            comments.data.sort(function(a, b) {
              return Date.parse(a.createdAt) - Date.parse(b.createdAt);
            });
            comments.data.forEach(function(comment) {
              if (comment.User) {
                MapFactory.appendComment(comment, comment.User.userName);
              }
            });
          }
        });
      });
    });
  }

  $scope.initPoints = function() {
    MapFactory.getPoints().then(function(data) {
      //Removes MapFactory plotPoints and renders data in controller
      var markers = $scope.plotPoints(data);
      $scope.mapPoints = data;
      $scope.copy = markers;
      map.addLayer(markers);

      addEventListeners(markers);
    });
  };

  $scope.plotPoints = function(points) {
    var markers = L.markerClusterGroup();
    var picIcon = L.Icon.extend({
      options: {
        iconSize: [40, 40],
        // shadowSize: [45,51],
        shadowSize: [50, 57],
        shadowAnchor: [24, 24.5]
      }
    });

    for (var i = 0; i < points.length; i++) {

      //Initialize each photo with no votes from user
      photoVotes[points[i].id] = false;

      var userName = points[i].User ? points[i].User.userName : "Anonymous";
      var html = '<div class="popup"><h3 class="photoDescription">' + points[i].description + '</h3>' + '<h6 class="photoUserName"> Uploaded by ' +
        userName + '</h6>' +
        '<div class="popupPhoto">' +
        '<img src= ' + points[i].photoUrl + ' height = "300", width = "300">' +
        '<div>' +
        '<span class="scoreicon"> <button class="fa fa-thumbs-up thumbs" ng-click="photoScoreIncr()" ng-disabled="thumbs"></button></span>' +
        '<span class="scoreicon"> <button class="fa fa-thumbs-down thumbs" ng-click="photoScoreDecr()" ng-disabled="!thumbs"></button></span></div>' +
        '<div><span class="score"> {{photoScore}} likes</span></div></div></div>';

      var linkFunction = $compile(angular.element(html));
      var newScope = $scope.$new();
      var picMarker = new L.marker([points[i].latitude, points[i].longitude], {
        time: points[i].timeStamp,
        icon: new picIcon({
          photoID: points[i].id,
          iconUrl: points[i].photoUrl,
          shadowUrl: 'http://4.bp.blogspot.com/-TJN_xoDt9OE/T9JoAzZ7seI/AAAAAAAABBw/wlp5T_omFKw/s1600/Taped+Polaroid+-+Jennifer+Fehr+Designs.png',
          score: points[i].score
        })
      });

      picMarker.bindPopup(linkFunction(newScope)[0]);
      markers.addLayer(picMarker);
    };
    $scope.copy = markers;
    return markers;
  };

  $scope.initPoints();

  // Post score to database
  var postScore = function() {
    var thumbs = $scope.thumbs;
    photoVotes[$scope.photoId] = thumbs;
    var data = {
      id: $scope.photoId,
      photoScore: $scope.photoScore
    }
    MapFactory.postScore(data);
  }

  // Increment photo score and post
  $scope.photoScoreIncr = function() {
    if (AuthFactory.isAuthenticated()) {
      $scope.photoScore += 1;
      $scope.thumbs = true;
      postScore();
    }
  };

  // Decrement photo score and post
  $scope.photoScoreDecr = function() {
    if (AuthFactory.isAuthenticated()) {
      $scope.photoScore -= 1;
      $scope.thumbs = false;
      postScore();
    }
  };


  $scope.hide = function() {
    MapFactory.hideCommentPane();
  }

  $scope.postComment = function() {
    if ($scope.comment.trim() !== "") {
      MapFactory.postComment($scope.photoId, $cookies["userID"], $scope.comment).then(function(comment) {
        angular.element(document.body.getElementsByTagName('textarea')).val('');
        MapFactory.appendComment(comment, $cookies["username"]);
      });
    }
  }

})

