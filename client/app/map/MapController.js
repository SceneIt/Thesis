angular.module('sceneit.map', [])

.controller('MapController',function($scope) {
<<<<<<< HEAD

    //loads the map onto the div
    var vizjson = 'http://secenit.cartodb.com/api/v2/viz/ba34720c-87c5-11e4-930e-0e853d047bba/viz.json';
    cartodb.createVis('map', vizjson, options);
    console.log('loaded');



		var options = {
			center: [40.4000, -3.6833] // Madrid
		};

=======
>>>>>>> c9a3d0eaa0db4228dae6f5e6b0755370917eee43
});