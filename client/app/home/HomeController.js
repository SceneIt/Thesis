angular.module('sceneit.home', [])

.controller('HomeController',function($scope, $state) {
	$scope.func = function() {
		//render map image
		$state.go('map');
		//testing
		console.log(2);
	}
	angular.element(document.body).css('background-image', 'url("../app/images/city.png")');
})

//this registers enter event on keydown
.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
 
                event.preventDefault();
            }
        });
    };
});

