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
function AddTeamPopupCtrl ($scope,$mdDialog,Football){
    $scope.close=function(){
        $mdDialog.hide();
    }
    $scope.createTeam=function(team){
        var newTeam={
          teamId:team.id,
          name:team.name,
          status:false
        };
        $scope.TeamIdAvailabilityPromise=Football.newTeamAvailability(team.id).then(function(res){
                $scope.teamIdNA=false;
        }).catch(function(e){
            $scope.teamIdNA=true;
            });
    }
};
function ViewTeamPopupCtrl ($scope,$mdDialog,Football,teamId){
     $scope.close=function(){
         $mdDialog.hide();
     }
    var id=teamId;
    //console.log(id);
    //$scope.createTeam=function(team){
      /*  var newTeam={
          teamId:team.id,
          name:team.name,
          status:false
        };
      */  
      $scope.ViewTeamPromise=Football.getTeamDetails(id).then(function(res){
                res=res.data.data[1];
                console.log(res);
                $scope.teamName=res.name;
                $scope.logo=res.logo;
                $scope.teamId=res.teamId;
                $scope.teamStatus=res.active;
                $scope.players=res.players;
        }).catch(function(e){
            //$scope.teamIdNA=true;
            });
    // }
};

dashControllers.controller('FootTeams', function ($scope, Football, PagerService, $mdDialog) {
    $scope.AddTeam = function(ev) {
    $mdDialog.show({
      controller: AddTeamPopupCtrl,
      templateUrl: 'dashboard/views/add.team.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: false
    });
    };
    $scope.ViewTeam = function(id,ev) {
    $mdDialog.show({
      controller: ViewTeamPopupCtrl,
      templateUrl: 'dashboard/views/view.team.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      locals:{
          teamId: id
          },
      clickOutsideToClose:true,
      fullscreen: true
    });
    console.log(id);
  };
  
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
    $scope.allTeamsPromise=Football.getAllTeams().then(function(Teams){
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
    function ViewPlayerPopupCtrl ($scope,$mdDialog,Football,playerId){
     $scope.close=function(){
         $mdDialog.hide();
     }
    var id=playerId;
    //console.log(id);
    //$scope.createTeam=function(team){
      /*  var newTeam={
          teamId:team.id,
          name:team.name,
          status:false
        };
      */  
      $scope.ViewPlayerPromise=Football.getPlayerDetails(id).then(function(res){
                res=res.data.data;
                console.log(res);
                $scope.teamName=res.name;
                $scope.logo=res.logo;
                $scope.teamId=res.teamId;
                $scope.teamStatus=res.active;
                $scope.players=res.players;
        }).catch(function(e){
            //$scope.teamIdNA=true;
            });
    // }
};
dashControllers.controller('FootPlayers', function ($scope, Football, PagerService, $mdDialog) {
   $scope.ViewPlayer = function(id,ev) {
    $mdDialog.show({
      controller: ViewPlayerPopupCtrl,
      templateUrl: 'dashboard/views/view.player.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      locals:{
          teamId: id
          },
      clickOutsideToClose:true,
      fullscreen: true
    });
    console.log(id);
  };
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
    $scope.allPlayersPromise=Football.getAllPlayers().then(function(Teams){
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
    
