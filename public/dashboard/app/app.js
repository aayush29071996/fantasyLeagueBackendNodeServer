'use strict';


var dashBoard = angular.module('dashBoard', [
    'ngRoute',
    'dashControllers',
    'dashServices'
]);

dashBoard.config(function($routeProvider, $locationProvider) {
        $routeProvider.
        when('/dashboard', {
            templateUrl: 'public/dashboard/views/profile.html',
            controller: 'homeController'
        })
       
        
        .otherwise({
            redirectTo: '/dashboard'
        });
        
        $locationProvider.html5Mode(true);
    });
