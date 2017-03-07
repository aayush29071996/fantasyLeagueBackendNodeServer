'use strict';


var dashControllers = angular.module('dashControllers', ['dashServices']);


dashControllers.controller('Admin', function($scope,$window){
    var headTitleLookup = {
            '': 'Dashboard',
            '#/dashboard': 'Dashboard',
            '#/football/teams': 'Football - Manage Teams',
            '#/football/players': 'Football - Manage Players'
        };
        
        $scope.headTitle = headTitleLookup[$window.location.hash];
});

dashControllers.controller('Dashboard', function () {
});

dashControllers.controller('FootTeams', function ($scope, Football, PagerService) {
    /*$scope.AddTeam = function(ev) {
    $mdDialog.show({/*
      controller: FootTeams,*/
      /*templateUrl: 'dashboard/views/add.team.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: true
    })
    .then(function(answer) {
      $scope.status = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.status = 'You cancelled the dialog.';
    });
  };*/
  
    $scope.selectedSort = 'teamId';
    //$scope.selectedRPP = "10";
    $scope.changedRPP = function(value){
        console.log(value);
        $scope.pager = {};
        $scope.setPage = setPage;

        initController();
        function initController() {
            // initialize to page 1
            $scope.setPage(1);
        }

        function setPage(page) {
            if (page < 1 || page > $scope.pager.totalPages) {
                return;
            }

            // get pager object from service
            $scope.pager = PagerService.GetPager($scope.footTeams.length, page, $scope.selectedRPP);
            // get current page of items
            $scope.items = $scope.footTeams.slice($scope.pager.startIndex, $scope.pager.endIndex + 1);
        }
        };
    Football.getAllTeams().then(function(Teams){
      $scope.footTeams = Teams.data.data; 

        $scope.pager = {};
        $scope.setPage = setPage;

        initController();

        function initController() {
            // initialize to page 1
            $scope.setPage(1);
        }

        function setPage(page) {
            if (page < 1 || page > $scope.pager.totalPages) {
                return;
            }

            // get pager object from service
            $scope.pager = PagerService.GetPager($scope.footTeams.length, page, $scope.selectedRPP);
            // get current page of items
            $scope.items = $scope.footTeams.slice($scope.pager.startIndex, $scope.pager.endIndex + 1);
        }
    });
});
    
dashControllers.controller('FootPlayers', function ($scope, Football, PagerService) {
  
    $scope.selectedSort = 'playerId';
    //$scope.selectedRPP = "10";
    $scope.changedRPP = function(value){
        console.log(value);
        $scope.pager = {};
        $scope.setPage = setPage;

        initController();
        function initController() {
            // initialize to page 1
            $scope.setPage(1);
        }

        function setPage(page) {
            if (page < 1 || page > $scope.pager.totalPages) {
                return;
            }

            // get pager object from service
            $scope.pager = PagerService.GetPager($scope.footTeams.length, page, $scope.selectedRPP);
            // get current page of items
            $scope.items = $scope.footTeams.slice($scope.pager.startIndex, $scope.pager.endIndex + 1);
        }
        };
    Football.getAllPlayers().then(function(Teams){
      $scope.footTeams = Teams.data.data; 
        console.log($scope.footTeams);
        $scope.pager = {};
        $scope.setPage = setPage;

        initController();

        function initController() {
            // initialize to page 1
            $scope.setPage(1);
        }

        function setPage(page) {
            if (page < 1 || page > $scope.pager.totalPages) {
                return;
            }

            // get pager object from service
            $scope.pager = PagerService.GetPager($scope.footTeams.length, page, $scope.selectedRPP);
            // get current page of items
            $scope.items = $scope.footTeams.slice($scope.pager.startIndex, $scope.pager.endIndex + 1);
        }
    });
});
    
