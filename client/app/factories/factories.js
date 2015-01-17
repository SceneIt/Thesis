angular.module('sceneit.factories', ['ngCookies'])

.factory('AuthFactory', function($state, $http, $window, $cookies) {

  //User authenticated check
  var isAuthenticated = function() {
    if ($cookies['userID']) {
      return true;
    }
    return false;
  };

  //Signup post to server
  var signup = function(user) {
    return $http({
      method: 'POST',
      url: '/api/user/signup',
      data: user
    }).then(function(res) {
      $state.go('home');
    });
  };

  //Signin post to server
  var signin = function(user) {
    return $http({
      method: 'POST',
      url: '/api/user/signin',
      data: user
    }).then(function(res) {
      $state.go('home');
    });
  };

  // Signout post to server
  var signout = function() {
    return $http({
      method: 'POST',
      url: '/api/user/logout'
    }).then(function(res) {
      $state.go('signin');
    });
  };

  return {
    signin: signin,
    signup: signup,
    signout: signout,
    isAuthenticated: isAuthenticated
  }
})

.factory('MapFactory', function($http) {
  var appendComment = function(comment, user) {
    var parentEl = document.querySelector('.commentContainer ul');
    var childEl = document.createElement('li');
    childEl.className = "webMessengerMessageGroup";
    childEl.innerHTML = '<div class="clearFix"><div class="profileimg"><img width="32" height="32" src="../app/images/profilepic.png"></div><div class="rightHalf"><div class="time"><abbr class="timeText">' + /*new Date(Date.parse(comment.createdAt)).toLocaleString()*/ moment(comment.createdAt).fromNow() + '</abbr></div><div class="nameWithComment"><div class="name"> <strong>' + user + '</strong></div><div class="userscomment"><p>' + comment.comment + '</p></div></div></div></div>';
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
  var findPhoto = function(coordinates) {
    return $http({
      method: 'GET',
      url: '/api/photo/getClickedPhoto',
      params: {
        lat: coordinates.lat,
        lng: coordinates.lng
      }
    }).then(function(res) {
      return res.data;
    });
  };

  var getCommentsForPhoto = function(id) {
    return $http.get('/api/comments/', {
        params: {
          id: id
        }
      })
      .success(function(res) {
        return (res);
      });
  };


  var postComment = function(id, user, comment) {
    return $http({
      method: 'POST',
      url: '/api/comments/',
      data: {
        photoid: id,
        userid: user,
        comment: comment
      }
    }).then(function(res) {
      return res.data;
    });
  };

  //getPoints function will return an array of objects
  var getPoints = function() {
    return $http({
      method: 'GET',
      url: '/api/photo/data'
    }).then(function(res) {
      return (res.data);
    });
  };

  //postPhotos function will post object into database
  var postPhotos = function(photoData) {
    return $http({
      method: 'POST',
      url: '/api/photo/data',
      data: photoData
    }).then(function(res) {
      return res.data;
    })
  };
  // Post score to database
  var postScore = function(data) {
    return $http({
      method: 'POST',
      url: '/api/photo/votes',
      data: data
    }).then(function(res) {
      console.log('success');
      return res.data;
    });;
  };

  // Get score from database
  var getScore = function(data) {
    return $http.get('/api/photo/votes', {
        params: {
          id: data
        }
      })
      .success(function(res) {
        return res.body;
      });
  };


  return {
    appendComment: appendComment,
    hideCommentPane: hideCommentPane,
    showCommentPane: showCommentPane,
    postComment: postComment,
    findPhoto: findPhoto,
    getCommentsForPhoto: getCommentsForPhoto,
    getPoints: getPoints,
    postPhotos: postPhotos,
    postScore: postScore,
    getScore: getScore
  };
});


