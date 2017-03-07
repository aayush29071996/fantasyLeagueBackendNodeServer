'use strict';
        
var dashBoard = angular.module('dashBoard', [
    'ngRoute',
    'dashControllers',
    'dashServices',
    'ngMaterial'
]);
dashBoard.run(function($rootScope){
  $rootScope._ = _;
});
dashBoard.config(function($routeProvider, $locationProvider) {
        $routeProvider
        .when('/dashboard', {
            cache: false,
            templateUrl: 'dashboard/views/dashboard.html',
            controller: 'Dashboard',
            headTitle: 'Dashboard'
        })
       .when('/football/teams', {
            cache: false,
            templateUrl: 'dashboard/views/football/teams.html',
            controller: 'FootTeams',
            headTitle: 'FootTeams'
        })
        
        .otherwise({
            redirectTo: '/dashboard'
        });
        
        $locationProvider.hashPrefix('');
    });
