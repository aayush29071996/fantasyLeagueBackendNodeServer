
angular.module('footTeamsCtrl',['dashServices'])
.controller('FootTeams', function ($scope, Football, $mdDialog, $state) {
    
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
                res=res.data.data[0];
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
                $scope.close();
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
  };
  
  
    $scope.selectedSort = 'teamId';
    $scope.selectedRPP = "10";
     $scope.changedRPP = function(value){
         $scope.selectedRPP=value;  
     };
    $scope.allTeamsPromise=Football.getAllTeams().then(function(Teams){
      $scope.footTeams = Teams.data.data;
    });
    $scope.updatedTeam={};
    $scope.updatedTeam.active=false;
    $scope.EditTeam=function(teamId){
      document.getElementById(teamId).children[1].style.display="none";
      document.getElementById(teamId).children[2].style.display="none";
      document.getElementById(teamId).children[3].style.display="table-cell";
      document.getElementById(teamId).children[4].style.display="table-cell";
      $scope.updatedTeam.name=document.getElementById(teamId).children[1].innerHTML;
      if(document.getElementById(teamId).children[2].innerHTML=="false"){
      $scope.updatedTeam.active=false;
            document.getElementById("statusBtn").className="btn btn-danger btn-trans waves-effect waves-danger w-md m-b-5";
      }
      else if(document.getElementById(teamId).children[2].innerHTML=="true"){
      $scope.updatedTeam.active=true;
            document.getElementById("statusBtn").className="btn btn-success btn-trans waves-effect waves-success w-md m-b-5";
      
      }
      console.log($scope.updatedTeam);
      document.getElementById(teamId).children[5].children[0].style.display="table-cell";
      document.getElementById(teamId).children[5].children[1].style.display="table-cell";
      document.getElementById(teamId).children[5].children[2].style.display="none";
      document.getElementById(teamId).children[5].children[3].style.display="none";
      document.getElementById(teamId).children[5].children[4].style.display="none";
    };
    
    $scope.cancelEdit=function(teamId){
      document.getElementById(teamId).children[1].style.display="table-cell";
      document.getElementById(teamId).children[2].style.display="table-cell";
      document.getElementById(teamId).children[3].style.display="none";
      document.getElementById(teamId).children[4].style.display="none";
      
      document.getElementById(teamId).children[5].children[0].style.display="none";
      document.getElementById(teamId).children[5].children[1].style.display="none";
      document.getElementById(teamId).children[5].children[2].style.display="inline";
      document.getElementById(teamId).children[5].children[3].style.display="inline";
      document.getElementById(teamId).children[5].children[4].style.display="inline";
        
    };
    $scope.clickedToggle=function(){
        console.log($scope.updatedTeam.active);
        if($scope.updatedTeam.active==true){
            $scope.updatedTeam.active=false;
            document.getElementById("statusBtn").className="btn btn-danger btn-trans waves-effect waves-danger w-md m-b-5";
        }
        else if($scope.updatedTeam.active==false){
            $scope.updatedTeam.active=true;
            document.getElementById("statusBtn").className="btn btn-success btn-trans waves-effect waves-success w-md m-b-5";
        }
    };
    
    $scope.postEdited=function(team){
        team.name=$scope.updatedTeam.name;
        team.active=$scope.updatedTeam.active;
         $scope.updateTeamPromise=Football.updateTeam(team).then(function(res){
            $scope.cancelEdit(team.teamId);
            window.location.reload();
         });
    };
});
