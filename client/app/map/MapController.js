angular.module('sceneit.map', [])

.controller('MapController',function($scope, $http, MapFactory) {
	//loads map tiles from custom maps of mapbox
	var layer = L.tileLayer('http://{s}.tiles.mapbox.com/v3/scenit.kgp870je/{z}/{x}/{y}.png',{
  	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	});
	//creates leaflet map with given lat / long points with zoom level of 6.
	var map = L.map('map', {
    center: [40.7127837, -74.0059413],
    zoom: 6
	});
  //initializes markercluster
	//add base map tiles
	map.addLayer(layer);
  $scope.initPoints = function(){
    MapFactory.getPoints().then(function(data){
      map.addLayer(MapFactory.plotPoints(data));
    });
  };

  $scope.initPoints();
  //calling the post photo function


  var control = L.control.geonames({username: 'cbi.test'});
  console.log(control);
  map.addControl(control);
     
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
  var plotPoints = function(points){
    var markers = L.markerClusterGroup();
    var picIcon = L.Icon.extend({
      options: {
        iconSize: [40, 40]
      }
    });
    for(var i = 0; i < points.length; i ++){
      var picMarker = new L.marker([points[i].latitude, points[i].longitude], {
        icon: new picIcon({
          iconUrl: points[i].photoUrl
        })
      });
      picMarker.bindPopup('<h5>'+points[i].description+'</h5><br></br><img src = '+points[i].photoUrl+' height = "300", width = "300">')
      markers.addLayer(picMarker);
    };
    console.log(markers);    
    return markers;
  };
  return {
    getPoints : getPoints,
    postPhotos : postPhotos,
    plotPoints : plotPoints
  };
});
