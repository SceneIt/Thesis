angular.module('sceneit.map', [])

.controller('MapController',function($scope, $http, MapFactory) {
	//loads map tiles from custom maps of mapbox
	var layer = L.tileLayer('http://{s}.tiles.mapbox.com/v3/scenit.kgp870je/{z}/{x}/{y}.png',{
  	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
	});
	//creates leaflet map with given lat / long points with zoom level of 6.
	var map = L.map('map', {
    center: [40.7127837, -74.0059413],
    zoom: 6
	});
  //initializes markercluster
  var markers = L.markerClusterGroup();
	//add base map tiles
	map.addLayer(layer);
  $scope.plotPoints = function(){
    MapFactory.getPoints().then(function(data){
      console.log(data);
      $scope.photos = data;
      for(var i = 0; i < $scope.photos.length; i ++){
        markers.addLayer(new L.marker([$scope.photos[i].latitude,$scope.photos[i].longitude]))
      }
      map.addLayer(markers);
    })
  }

  $scope.plotPoints()
  //calling the post photo function
})

.factory('MapFactory', function($http){
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
      url: 'api/photo/data',
      data: photoData
    }).then(function(res){
        console.log('uplodaded',res.data);
        return res.data;
    })
  };
  return {
    getPoints : getPoints,
    postPhotos : postPhotos
  }
})