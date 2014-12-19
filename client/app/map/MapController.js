angular.module('sceneit.map', [])

.controller('MapController',function($scope) {
	var options = {
    center: [40.4000, -3.6833], // Madrid
    zoom: 7,
    scrollwheel: true,
    shareable: false
	};

    var vizjson = 'http://secenit.cartodb.com/api/v2/viz/ba34720c-87c5-11e4-930e-0e853d047bba/viz.json';
    cartodb.createVis('map', vizjson, options);
    console.log('loaded');
});