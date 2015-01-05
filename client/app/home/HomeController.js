angular.module('sceneit.home', [])

.controller('HomeController',function($scope, $state) {
	$scope.func = function() {
		//render map image
		$state.go('map');
		//testing
	}
})

//this registers enter event on keydown
// .directive('ngEnter', function () {
//     return function (scope, element, attrs) {
//         element.bind("keydown keypress", function (event) {
//             if(event.which === 13) {
//                 scope.$apply(function (){
//                     scope.$eval(attrs.ngEnter);
//                 });
 
//                 event.preventDefault();
//             }
//         });
//     };
// })

.directive('skrollrTag', ['skrollrService', 
    function(skrollrService){
        return {
            link: function(scope, element, attrs){
                skrollrService.skrollr().then(function(skrollr){
                    skrollr.refresh();
                });

               //This will watch for any new elements being added as children to whatever element this directive is placed on. 
               //If new elements are added, Skrollr will be refreshed to pull in new elements
               scope.$watch(
                   function () { 
                    return element[0].childNodes.length; 
                   },
                   function (newValue, oldValue) {
                     if (newValue !== oldValue) {
                         skrollrService.skrollr().then(function(skrollr){
                             skrollr.refresh();
                         });
                     }
                   }
               );
            }
        };
    }
])

.service('skrollrService', ['$document', '$q', '$rootScope', '$window', 
    function($document, $q, $rootScope, $window){
        var defer = $q.defer();

        function onScriptLoad() {
            // Load client in the browser
            $rootScope.$apply(function() { 
                var s = $window.skrollr.init({
                        forceHeight: false
                });
                defer.resolve(s); 
            });
        }

        // Create a script tag with skrollr as the source
        // and call our onScriptLoad callback when it
        // has been loaded

        var scriptTag = $document[0].createElement('script');
        scriptTag.type = 'text/javascript'; 
        scriptTag.async = true;
        scriptTag.src = '/lib/skrollr.min.js';

        scriptTag.onreadystatechange = function () {
            if (this.readyState === 'complete') onScriptLoad();
        };

        scriptTag.onload = onScriptLoad;

        var s = $document[0].getElementsByTagName('body')[0];
        s.appendChild(scriptTag);

        return {
            skrollr: function() {
             return defer.promise; 
            }
        };

    }
 ]);

