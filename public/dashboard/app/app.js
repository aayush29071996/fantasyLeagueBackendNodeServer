'use strict';
        
var dashBoard = angular.module('dashBoard', [
    'ui.router',
    'dashControllers',
    'dashServices',
    'ngMaterial',
    'cgBusy'
]);
dashBoard.run(function($rootScope){
  $rootScope._ = _;
});
dashBoard.config(function($stateProvider, $locationProvider, $urlRouterProvider) {
        $stateProvider
        .state('login', {
            cache: false,
            url:'/login',
            templateUrl: 'dashboard/views/login.html',
            controller: 'Login'
         })
        .state('dashboard', {
            cache: false,
            url:'/dashboard',
            templateUrl: 'dashboard/views/dashboard.html',
            controller: 'Dashboard'
        })
    //   .when('/football/teams', {
    //         cache: false,
    //         templateUrl: 'dashboard/views/football/teams.html',
    //         controller: 'FootTeams'
    //     })
    //     .when('/football/players', {
    //         cache: false,
    //         templateUrl: 'dashboard/views/football/players.html',
    //         controller: 'FootPlayers'
    //     })
        
        $urlRouterProvider.otherwise('/login');
        
        $locationProvider.hashPrefix('');
    });
