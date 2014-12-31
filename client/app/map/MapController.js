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


	//adds custom map layer to maps
	map.addLayer(layer);
  MapFactory.getPoints();
  //getPoints();
})

.factory('MapFactory', function($http){
  var getPoints = function(){
    return $http({
      method: 'GET',
      url: '/api/photo/data'
    }).then(function(res){
      console.log(res.data);
    });
  }
  return {
    getPoints : getPoints
  }
})