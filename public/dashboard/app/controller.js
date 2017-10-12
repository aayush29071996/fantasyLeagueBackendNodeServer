'use strict';


var dashControllers = angular.module('dashControllers', ['dashServices']);

dashControllers.controller('Login', function ($scope, Auth, $state, $timeout,Football) {
    $scope.user={};
    $scope.btnText="Login";
    $scope.loginError=false;
    $scope.doLogin=function(){
        $scope.btnText="Logging In...";
        var userData = {
            username: $scope.user.username,
            password: $scope.user.password
        };

        // Auth.authenticate(userData).then(function(res){
            if($scope.user.username === "admin@inyards.com" && $scope.user.password === "admin-2017")
                $state.go('admin.dashboard');
            else{
                $scope.btnText="Login";
                $scope.loginError=true;
                $timeout(function(){
                    $scope.loginError=false;
                },2000);
            }
        // });
    };
});

dashControllers.controller('Dashboard', function () {
})



dashControllers.controller('FootFixtures', function($mdDialog, $stateParams, LeaderboardApi, $scope, Football, Auth, $state, $timeout, moment,$filter) {
    $scope.LiveMatchPromise = Football.getLiveMatches().then(function(response){
        $scope.liveMatches = response.data;
        console.log($scope.liveMatches);

        $scope.UpcomingMatchPromise = Football.getUpcomingMatches().then(function(resp){
            $scope.upcomingMatches = resp.data;
            console.log($scope.upcomingMatches);


            $scope.PastMatchPromise = Football.getPastMatches().then(function(res){
                $scope.pastMatches = res.data;
                console.log($scope.pastMatches);
            });
        });
    });
    $scope.returnIST = function(date){
        return moment(date).utcOffset('+0530').format('YYYY-MM-DD HH:mm');
    };

    $scope.updatedFixture={};
    $scope.updatedFixture.active=false;
    $scope.EditFixture=function(matchId){
      document.getElementById(matchId).children[4].style.display="none";
      document.getElementById(matchId).children[5].style.display="table-cell";

      if(document.getElementById(matchId).children[4].innerHTML=="false"){
      $scope.updatedFixture.active=false;
            document.getElementById("statusBtn").className="btn btn-danger btn-trans waves-effect waves-danger w-md m-b-5";
      }
      else if(document.getElementById(matchId).children[4].innerHTML=="true"){
      $scope.updatedFixture.active=true;
            document.getElementById("statusBtn").className="btn btn-success btn-trans waves-effect waves-success w-md m-b-5";

      }
      console.log($scope.updatedFixture);
      document.getElementById(matchId).children[6].children[0].style.display="table-cell";
      document.getElementById(matchId).children[6].children[1].style.display="table-cell";
      document.getElementById(matchId).children[6].children[2].style.display="none";
    };

    $scope.cancelEdit=function(matchId){
      document.getElementById(matchId).children[4].style.display="table-cell";
      document.getElementById(matchId).children[5].style.display="none";

      document.getElementById(matchId).children[6].children[0].style.display="none";
      document.getElementById(matchId).children[6].children[1].style.display="none";
      document.getElementById(matchId).children[6].children[2].style.display="inline";

    };
    $scope.clickedToggle=function(){
        console.log($scope.updatedFixture.active);
        if($scope.updatedFixture.active==true){
            $scope.updatedFixture.active=false;
            document.getElementById("statusBtn").className="btn btn-danger btn-trans waves-effect waves-danger w-md m-b-5";
        }
        else if($scope.updatedFixture.active==false){
            $scope.updatedFixture.active=true;
            document.getElementById("statusBtn").className="btn btn-success btn-trans waves-effect waves-success w-md m-b-5";
        }
    };

    $scope.postEdited=function(matchId){
         $scope.updateMatchPromise=Football.toggleMatchStatus(matchId,$scope.updatedFixture.active).then(function(res){
            $scope.cancelEdit(matchId);
            window.location.reload();
         });
    };
    $scope.ViewLeaderboard = function(id,ev) {
    $mdDialog.show({
      controller: ViewLeaderboardPopupCtrl,
      templateUrl: 'dashboard/views/football/view.leaderboard.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      locals:{
          matchId: id
          },
      clickOutsideToClose:true,
      fullscreen: true
    });
    console.log(id);
  };
  function ViewLeaderboardPopupCtrl ($scope,$mdDialog,Football,matchId){
       $scope.close=function(){
           $mdDialog.hide();
       }
      var id=matchId;
      LeaderboardApi.getLeaderboard(id).then(function(resp){
              resp=resp.data.data;
              $scope.leaderboard=resp;
              $scope.totalParticipants=resp.length;
              console.log(resp);
              $scope.records=resp;
            }).catch(function(e){
              });
  };

    function ViewEventsPopUpCtrl($scope, $mdDialog, fixture){
      $scope.close = function(){
        $mdDialog.hide();
      };

      $scope.fixture = fixture;
      $scope.returnIST = function(date){
        return moment(date).utcOffset('+0530').format('YYYY-MM-DD HH:mm');
      };
    };
    
    function ViewLineupPopUpCtrl($scope, $mdDialog, fixture, Football, $filter){
      $scope.close = function(){
        $mdDialog.hide();
      };
      
      $scope.fixture = fixture;
      $scope.fixturePromise = Football.getMatchLP(fixture.match.matchId).then(function(res){
        // var match = res.data.data;
        // var players = match.team1.players.concat(match.team2.players);
        // var playerLineup = [];
        // console.log('lineup length => ' + fixture.match.lineup.length);
        // console.log('players length => ' + players.length);
        // fixture.match.lineup.forEach(function(lineup, index){
        //   console.log('Fetching player -> ' + lineup.playerId);
        //   var playerObj = players.filter(function(player){
        //       return lineup.playerId === player.playerId;
        //   })[0];
        //   console.log(playerObj);
        //   if(typeof playerObj !== 'undefined'){
        //     console.log('Got player -> ' + playerObj.playerId);
        //     var newPlayerObj = {};
        //     newPlayerObj.playerId = playerObj.playerId;
        //     newPlayerObj.playerName = playerObj.name;
        //     newPlayerObj.playerPosition = playerObj.position;
        //     newPlayerObj.playerPositionId = playerObj.positionId;
        //     newPlayerObj.playerActive = playerObj.active;
        //     newPlayerObj.playerDetails = lineup;
        //     playerLineup.push(newPlayerObj);
        //      console.log("FINAL ARRAY LENGTH -> " + playerLength.length);
        //     // console.log('Index ->' + index);
        //     $scope.playerLineup = playerLineup;
        //   } else {
        //     console.log('undefined player');
        //   }
        // }); 

        $scope.playerLineup = res.data.data;


      });

      $scope.returnIST = function(date){
        return moment(date).utcOffset('+0530').format('YYYY-MM-DD HH:mm');
      };
    };

    $scope.ViewEvents = function(fixture, event){
      // console.log(fixture);
      $mdDialog.show({
        controller:ViewEventsPopUpCtrl,
        templateUrl:'dashboard/views/football/view.events.html',
        parent:angular.element(document.body),
        locals:{
          fixture:fixture
        },
        targetEvemt:event,
        clickOutsideToClose:false,
        fullscreen:false
      });
    };

    $scope.ViewLineup = function(fixture, event){
      // console.log(fixture);
      $mdDialog.show({
        controller:ViewLineupPopUpCtrl,
        templateUrl:'dashboard/views/football/view.lineup.html',
        parent:angular.element(document.body),
        locals:{
          fixture:fixture
        },
        targetEvemt:event,
        clickOutsideToClose:false,
        fullscreen:false
      });
    };

})



dashControllers.controller('Play', function ($scope, Auth, $state, $timeout,Football) {
    $scope.user={};
    $scope.btnplay="PLAY";
    $scope.playFootball=function(){
        $scope.btnplay="Playing In...";


        // Auth.authenticate(userData).then(function(res){

            $state.go('play');

        // });
    };
});




dashControllers.controller('Points', function($scope) {
})

// dashControllers

dashControllers.controller('FootApis', function($scope, Football, Auth, $state, $timeout) {
})
dashControllers.controller('CricTeams', function($scope, Auth, $state, $timeout) {

})
dashControllers.controller('CricPlayers', function($scope, Auth, $state, $timeout) {

})
dashControllers.controller('CricFixtures', function($scope, Auth, $state, $timeout) {

})
dashControllers.controller('CricApis', function($scope, Auth, $state, $timeout) {

})
