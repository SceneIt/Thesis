  angular.module('sceneit.map', [])
  .directive('ngEnter', function() {
          return function(scope, element, attrs) {
              element.bind("keydown keypress", function(event) {
                  if(event.which === 13) {
                      scope.$apply(function(){
                          scope.$eval(attrs.ngEnter, {'event': event});
                      });

                      event.preventDefault();
                  }
              });
          };
  })


  .controller('MapController',function($scope, $http, MapFactory, Auth, $cookies, $compile, $interval) {

    $scope.comment = "";
    $scope.photoId = "";

    //loads map tiles from custom maps of mapbox
    var layer = L.tileLayer('http://{s}.tiles.mapbox.com/v3/mochicat8.kmifnp9g/{z}/{x}/{y}.png',{
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    //creates leaflet map with given lat / long points with zoom level of 6.
    var map = L.map('map', {
      zoom: 6
    });
  //initializes markercluster
  //add base map tiles
  map.addLayer(layer);
  map.locate({setView: true, maxZoom: 10});
  $interval($scope.initPoints,5000)
  //calling the post photo function


    $scope.initPoints = function(){
      MapFactory.getPoints().then(function(data){
        //Removes MapFactory plotPoints and renders data in controller
        var markers = $scope.plotPoints(data);
        map.addLayer(markers);
        markers.on('click', function(e) {
          angular.element(document.body.getElementsByTagName('ul')).text('');

          // console.log('coordinates', e.latlng);
          $scope.$apply(function(){
            MapFactory.showCommentPane();
              console.log(e.layer.options.icon.options);
              $scope.photoId = e.layer.options.icon.options.photoID;
              $scope.photoScore = e.layer.options.icon.options.score;
              $scope.photoLikes = ($scope.photoScore > 0) ? $scope.photoScore : 0;
              MapFactory.getCommentsForPhoto($scope.photoId).then(function(comments) {
                if(comments.data === "null" || comments.data.length === 0) {
                  // angular.element(window.document.body.getElementsByTagName('ul')).append('<li> No comments yet. </li>');
                } else {
                  comments.data.sort(function(a, b) {
                    return Date.parse(a.createdAt) - Date.parse(b.createdAt);
                  });
                  comments.data.forEach(function(comment) {
                    MapFactory.appendComment(comment);
                  });
                }
              });
          });
        });
      }); 
    };

     $scope.plotPoints = function(points){
      console.log('points', points);
      var markers = L.markerClusterGroup();
      var picIcon = L.Icon.extend({
        options: {
          iconSize: [40, 40]
        }
      });

      for(var i = 0; i < points.length; i ++){
        var userName = points[i].User ? points[i].User.userName : "Anonymous";
        var html = '<div class="popup"><h5 class="photoUserName">' + userName+ '</h5> <h5 class="photoDescription">' +   points[i].description+'</h5>' + 
        '<div class="popupPhoto">'+
          '<img src= '+points[i].photoUrl+' height = "300", width = "300">' +
          '<div>' +
          '<span class="fa fa-thumbs-up thumbs" ng-click="photoScoreIncr()"></span>'+
          '<span class="fa fa-thumbs-down thumbs" ng-click = "photoScoreDecr()"></span></div>' + 
          '<div><span class="score"> {{photoLikes}} likes</span></div></div></div>';

        var linkFunction = $compile(angular.element(html));
        var newScope = $scope.$new();

        var picMarker = new L.marker([points[i].latitude, points[i].longitude], {
          icon: new picIcon({
            photoID: points[i].id,
            iconUrl: points[i].photoUrl,
            score: points[i].score
          })
        });

        picMarker.bindPopup(linkFunction(newScope)[0]);
        markers.addLayer(picMarker);
      };

      return markers;
    };

    $scope.initPoints();
    

    $scope.photoScoreIncr = function(){
      $scope.photoScore += 1;
      $scope.photoLikes = ($scope.photoScore > 0) ? $scope.photoScore : 0;
      var data = {
        photoId: $scope.photoId,
        photoScore: $scope.photoScore
      };
      MapFactory.postScore(data);
    };

    $scope.photoScoreDecr = function(){
  
      $scope.photoScore -= 1;
      $scope.photoLikes = ($scope.photoScore > 0) ? $scope.photoScore : 0;
      var data = {
        photoId: $scope.photoId,
        photoScore: $scope.photoScore
      };
      MapFactory.postScore(data);      
    };


    $scope.hide = function() {
      MapFactory.hideCommentPane();
    }
    $scope.postComment = function() {
      if($scope.comment.trim() !== "") {
        MapFactory.postComment($scope.photoId, $cookies["userID"], $scope.comment).then(function(comment) {
          angular.element(document.body.getElementsByTagName('textarea')).val('');
          MapFactory.appendComment(comment);
        });
      }
    }
    //calling the post photo function

    var control = L.control.geonames({username: 'cbi.test'});
    map.addControl(control);
    map.on('click', function() {
        MapFactory.hideCommentPane();
    })

    // angular.element(window.document.body.getElementsByClassName('commentPane')).append('<textarea type="text" class="form-control textarea" rows="3" placeholder="Write a comment..." ng-model="comment" ng-enter="postComment()"></textarea>');
    if(!Auth.isAuthenticated()) {
      // angular.element(window.document.body.getElementsByTagName('textarea')).css('display','none');
    }
  })

  .factory('MapFactory', function($http, Auth, $compile){
    var appendComment = function(comment) {
      var parentEl = document.querySelector('.commentPane ul');
      var childEl = document.createElement('li');
      childEl.className = "webMessengerMessageGroup";
      childEl.innerHTML = '<div class="clearFix"><div class="profileimg"><img width="32" height="32" src="../app/images/profilepic.png"></div><div class="rightHalf"><div class="time"><abbr class="timeText">'+ /*new Date(Date.parse(comment.createdAt)).toLocaleString()*/ moment(comment.createdAt).fromNow() +'</abbr></div><div class="nameWithComment"><strong class="name">' + Auth.userInfo.username + '</strong><div class="userscomment"><p>' +  comment.comment + '</p></div></div></div></div>';
      parentEl.appendChild(childEl);
    }
    var showCommentPane = function() {
      angular.element(document.body.getElementsByClassName('mapStyle')).css("width", "80%");
      angular.element(document.body.getElementsByClassName('commentPane')).css("display", "block");
    };


    var hideCommentPane = function() {
      angular.element(document.body.getElementsByClassName('mapStyle')).css("width", "100%");
      angular.element(document.body.getElementsByClassName('commentPane')).css("display", "none");
    };
    var findPhoto = function(coordinates){
      return $http({
        method: 'GET',
        url: '/api/photo/getClickedPhoto',
        params: {lat: coordinates.lat, lng: coordinates.lng}
      }).then(function(res){
        return res.data;
      });
    };

    var getCommentsForPhoto = function(id){
      return $http.get('/api/comments/', {params: {id: id}})
      .success(function(res){
        return(res);
      });
    };


    var postComment = function(id, user, comment){
      console.log(id, user, comment);
      return $http({
        method: 'POST',
        url: '/api/comments/',
        data: {photoid: id, userid: user, comment: comment}
      }).then(function(res){
          return res.data;
      });
    };

    //getPoints function will return an array of objects
    var getPoints = function(){
      return $http({
        method: 'GET',
        url: '/api/photo/data'
      }).then(function(res){
        return(res.data);
      });
    };
    //postPhotos function will post object into database
    var postPhotos = function(photoData){
      return $http({
        method: 'POST',
        url: '/api/photo/data',
        data: photoData
      }).then(function(res){
          console.log('uplodaded',res.data);
          return res.data;
      })
    };

    var postScore = function(data){
      return $http({
        method: 'POST',
        url: '/api/photo/votes',
        data: data
      }).then(function(res){
        return res.data;
      });;
    };
   
    return {
      appendComment : appendComment,
      hideCommentPane : hideCommentPane,
      showCommentPane : showCommentPane,
      postComment : postComment,
      findPhoto : findPhoto,
      getCommentsForPhoto: getCommentsForPhoto,
      getPoints : getPoints,
      postPhotos : postPhotos,
      postScore: postScore
    };
  });
