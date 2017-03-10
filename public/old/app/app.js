'use strict';


var dashBoard = angular.module('dashBoard', [
    'ui.router',
    'dashControllers',
    'dashServices'
]);

dashBoard.config(function($stateProvider,$locationProvider,$urlRouterProvider) {
        $stateProvider
        .state("dashboard", {
            url: '/app/dashboard',
            templateUrl: "dashboard/pages/dashboard/dashboard.html",
            controller: "DashboardController",
/*            controllerAs: "dashboard"*/
        });
       
        $urlRouterProvider.otherwise("/app/dashboard");
        $locationProvider.hashPrefix('');/*
        $locationProvider.html5Mode(true);*/
    });
