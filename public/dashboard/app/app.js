'use strict';

var dashBoard = angular.module('dashBoard', [
    'ui.router',
    'angularUtils.directives.dirPagination',
    'dashboardCtrl',
    'userCustCtrl',
    'userEmpCtrl',
    'userVendorsCtrl',
    'footTeamsCtrl',
    'footPlayersCtrl',
    'dashControllers',
    'dashServices',
    'ngMaterial',
    'cgBusy',
    'angularMoment'
]);
dashBoard.run(function($rootScope) {
    $rootScope._ = _;
});
dashBoard.config(function($stateProvider, $locationProvider, $urlRouterProvider) {
    $stateProvider
        .state('login', {
            cache: false,
            url: '/login',
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
        // .state('admin.users', {
        //   url: '/users',
        //   views: {
        //     'admin-users': {
        //       templateUrl: 'dashboard/views/admin-users.html',
        //       controller: 'Users'
        //     }
        //   }
        // })
        .state('admin.points', {
            url: '/points',
            views: {
                'admin-points': {
                    templateUrl: 'dashboard/views/admin-points.html',
                    controller: 'Points'
                }
            }
        })
        .state('admin.usercust', {
            url: '/users/customers',
            views: {
                'admin-users-customers': {
                    templateUrl: 'dashboard/views/users/customers.html',
                    controller: 'UserCust'
                }
            }
        })
        .state('admin.useremp', {
            url: '/users/employees',
            views: {
                'admin-users-employees': {
                    templateUrl: 'dashboard/views/users/employees.html',
                    controller: 'UserEmp'
                }
            }
        })
        .state('admin.uservendors', {
            url: '/users/vendors',
            views: {
                'admin-users-vendors': {
                    templateUrl: 'dashboard/views/users/vendors.html',
                    controller: 'UsersVendors'
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
        .state('admin.footballManual', {
            url: '/football/event/:id',
            views: {
                'admin-football-event': {
                    templateUrl: 'dashboard/views/football/event.manual.html',
                    controller: 'eventCtrl'
                }
            }
        });

    $urlRouterProvider.otherwise('/login');

    $locationProvider.hashPrefix('');
}).directive('countdown', [
    'Util',
    '$interval',
    function(Util, $interval) {
        return {
            restrict: 'A',
            scope: { date: '@' },
            link: function(scope, element) {
                var future;
                future = new Date(scope.date);
                var timericon = "<i class=\"icon ion-ios-stopwatch-outline\"><\/i>&nbsp;"
                $interval(function() {
                    var diff;
                    diff = Math.floor((future.getTime() - new Date().getTime()) / 1000);
                    return element.html(timericon + Util.dhms(diff));
                }, 1000);
            }
        };
    }
]).factory('Util', [function() {
    return {
        dhms: function(t) {
            var days, hours, minutes, seconds;
            days = Math.floor(t / 86400);
            t -= days * 86400;
            hours = Math.floor(t / 3600) % 24;
            t -= hours * 3600;
            minutes = Math.floor(t / 60) % 60;
            t -= minutes * 60;
            seconds = t % 60;
            if (hours < 10)
                hours = "0" + hours;

            if (minutes < 10)
                minutes = "0" + minutes;

            if (seconds < 10)
                seconds = "0" + seconds;
            if (days == 0) {
                if (hours == 0) {
                    if (minutes == 0) {
                        return [
                            seconds + ''
                        ].join('');
                    } else {
                        return [
                            minutes + ':',
                            seconds + ''
                        ].join('');
                    }
                } else {
                    return [
                        hours + ':',
                        minutes + ':',
                        seconds + ''
                    ].join('');
                }
            } else {
                return [
                    days + 'D:',
                    hours + ':',
                    minutes + ':',
                    seconds + ''
                ].join('');
            }
        }
    };
}]);