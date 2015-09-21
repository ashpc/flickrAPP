'use strict';


/* App Module  that includes all the modules needed for this cu.App module
 ngRoute --- for routing
 ui.bootstrap --- for all bootstrap funcitionalities
 controllers -- controller module that has all the controllers used
 services -- services module that has all the controllers used
 filters -- filters module that has all the controllers used

 */

var flickrApp = angular.module('flickrApp', [
    'ngRoute',
    'ui.bootstrap',
    'flickrControllers',
    'flickrServices',
    'flickrFilters'
]);


/*
 Define all the routing used for this app
 templateUrl --> have the partial url defined
 controller --> what controller to use

 */

flickrApp.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
        $routeProvider.
            when('/home', {
                templateUrl: 'static/partials/home.html',
                controller: ''
            }).
            when('/pictures', {
                templateUrl: 'static/partials/pictures.html',
                controller: 'PicturesController',
                reloadOnSearch: false
            }).

            otherwise({
                redirectTo: '/home'
            });
        /* use the HTML5 History API
         $locationProvider.html5Mode({
         enabled: true,
         requireBase: false
         });*/
    }]);

flickrApp.run(function ($rootScope, $log) {


});