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

        Auth.authenticate(userData).then(function(res){
            if(res.data.success)
                $state.go('admin.dashboard');
            else{
                $scope.btnText="Login";
                $scope.loginError=true;
                $timeout(function(){
                    $scope.loginError=false;
                },2000);
            }
        });
    };
});

dashControllers.controller('Dashboard', function () {
})


dashControllers.controller('FootFixtures', function($mdDialog, $stateParams, LeaderboardApi, $scope, Football, Auth, $state, $timeout, moment) {
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

})


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
