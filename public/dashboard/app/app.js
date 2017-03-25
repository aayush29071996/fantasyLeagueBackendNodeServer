'use strict';
        
var dashBoard = angular.module('dashBoard', [
    'ui.router',
    'dashboardCtrl',
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
         .state('admin', {
            url: '/home',
            abstract: true,
            templateUrl: 'dashboard/views/admin.html',
            controller: 'Admin'
          })
        
          .state('admin.dashboard', {
            url: '/dashboard',
            views: {
              'admin-dashboard': {
                templateUrl: 'dashboard/views/admin-dashboard.html',
                controller: 'Dashboard'
              }
            }
          })
          .state('admin.users', {
            url: '/users',
            views: {
              'admin-users': {
                templateUrl: 'dashboard/views/admin-users.html',
                controller: 'Users'
              }
            }
          })
          .state('admin.footteams', {
            url: '/football/teams',
            views: {
              'admin-football-teams': {
                templateUrl: 'dashboard/views/football/teams.html',
                controller: 'FootTeams'
              }
            }
          })
          .state('admin.footplayers', {
            url: '/football/players',
            views: {
              'admin-football-players': {
                templateUrl: 'dashboard/views/football/players.html',
                controller: 'FootPlayers'
              }
            }
          })
          .state('admin.footfixtures', {
            url: '/football/fixtures',
            views: {
              'admin-football-fixtures': {
                templateUrl: 'dashboard/views/football/fixtures.html',
                controller: 'FootFixtures'
              }
            }
          })
          .state('admin.footapis', {
            url: '/football/apis',
            views: {
              'admin-football-apis': {
                templateUrl: 'dashboard/views/football/apis.html',
                controller: 'FootApis'
              }
            }
          })
          .state('admin.cricteams', {
            url: '/cricket/teams',
            views: {
              'admin-cricket-teams': {
                templateUrl: 'dashboard/views/cricket/teams.html',
                controller: 'CricTeams'
              }
            }
          })
          .state('admin.cricplayers', {
            url: '/cricket/players',
            views: {
              'admin-cricket-players': {
                templateUrl: 'dashboard/views/cricket/players.html',
                controller: 'CricPlayers'
              }
            }
          })
          .state('admin.cricfixtures', {
            url: '/cricket/fixtures',
            views: {
              'admin-cricket-fixtures': {
                templateUrl: 'dashboard/views/cricket/fixtures.html',
                controller: 'CricFixtures'
              }
            }
          })
          .state('admin.cricapis', {
            url: '/cricket/apis',
            views: {
              'admin-cricket-apis': {
                templateUrl: 'dashboard/views/cricket/apis.html',
                controller: 'CricApis'
              }
            }
          })
        
        $urlRouterProvider.otherwise('/login');
        
        $locationProvider.hashPrefix('');
    });
