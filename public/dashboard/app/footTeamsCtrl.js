
angular.module('footTeamsCtrl',['dashServices'])
.controller('FootTeams', function ($scope, Football, PagerService, $mdDialog, $state) {
    
function AddTeamPopupCtrl ($scope,$mdDialog,Football){
    $scope.close=function(){
        $mdDialog.hide();
    }
    $scope.createTeam=function(team){
        var newTeamObj={
          teamId:team.id,
          name:team.name,
          logo:team.logo,
          status:false
        };
        $scope.TeamIdAvailabilityPromise=Football.newTeamAvailability(team.id).then(function(res){
                $scope.teamIdNA=false;
                $scope.createTeamPromise = Football.newTeam(newTeamObj).then(function(res){
                    $scope.close();
                    window.location.reload();
                    })
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
      $scope.ViewTeamPromise=Football.getTeamDetails(id).then(function(res){
                res=res.data.data[1];
                console.log(res);
                $scope.teamName=res.name;
                $scope.logo=res.logo;
                $scope.teamId=res.teamId;
                $scope.teamStatus=res.active;
                $scope.players=res.players;
        }).catch(function(e){
            });
};

function DeleteTeamPopupCtrl ($scope,$mdDialog,Football,teamId,teamName){
    $scope.teamName=teamName;
    $scope.close=function(){
        $mdDialog.hide();
    }
    $scope.deleteTeam=function(){
        $scope.DeleteTeamPromise=Football.deleteTeam(teamId).then(function(res){
                window.location.reload();
        }).catch(function(e){
            $scope.deleteResponse=e.data;
            });
    }
}

    $scope.AddTeam = function(ev) {
    $mdDialog.show({
      controller: AddTeamPopupCtrl,
      templateUrl: 'dashboard/views/football/add.team.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: false
    });
    };
    $scope.ViewTeam = function(id,ev) {
    $mdDialog.show({
      controller: ViewTeamPopupCtrl,
      templateUrl: 'dashboard/views/football/view.team.html',
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
  $scope.DeleteTeam = function(id,name,ev) {
    $mdDialog.show({
      controller: DeleteTeamPopupCtrl,
      templateUrl: 'dashboard/views/football/delete.team.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      locals:{
          teamId: id,
          teamName: name
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
