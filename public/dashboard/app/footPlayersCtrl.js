angular.module('footPlayersCtrl',['dashServices'])
.controller('FootPlayers', function ($scope, Football, $mdDialog) {
    function AddPlayerPopupCtrl ($scope,$mdDialog,Football){
    $scope.close=function(){
        $mdDialog.hide();
    }
    $scope.createPlayer=function(player){
        var newPlayerObj={
          playerId:player.id,
          name:player.name,
          status:false
        };
        $scope.PlayerIdAvailabilityPromise=Football.newPlayerAvailability(player.id).then(function(res){
                $scope.playerIdNA=false;
                $scope.createPlayerPromise = Football.newPlayer(newPlayerObj).then(function(res){
                    $scope.close();
                    window.location.reload();
                    })
        }).catch(function(e){
            $scope.playerIdNA=true;
            });
    }
};
function ViewPlayerPopupCtrl ($scope,$mdDialog,Football,playerId){
     $scope.close=function(){
         $mdDialog.hide();
     }
    var id=playerId;
      $scope.ViewPlayerPromise=Football.getPlayerDetails(id).then(function(res){
                res=res.data.data[0];
                console.log(res);
                $scope.playerName=res.name;
                $scope.logo=res.logo;
                $scope.playerId=res.playerId;
                $scope.playerStatus=res.active;
                $scope.players=res.players;
        }).catch(function(e){
            });
};

function DeletePlayerPopupCtrl ($scope,$mdDialog,Football,playerId,playerName){
    $scope.playerName=playerName;
    $scope.close=function(){
        $mdDialog.hide();
    }
    $scope.deletePlayer=function(){
        $scope.DeletePlayerPromise=Football.deletePlayer(playerId).then(function(res){
                $scope.close();
                window.location.reload();
        }).catch(function(e){
            $scope.deleteResponse=e.data;
            });
    }
}

    $scope.AddPlayer = function(ev) {
    $mdDialog.show({
      controller: AddPlayerPopupCtrl,
      templateUrl: 'dashboard/views/football/add.player.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: false
    });
    };
    $scope.ViewPlayer = function(id,ev) {
    $mdDialog.show({
      controller: ViewPlayerPopupCtrl,
      templateUrl: 'dashboard/views/football/view.player.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      locals:{
          playerId: id
          },
      clickOutsideToClose:true,
      fullscreen: true
    });
    console.log(id);
  };
  $scope.DeletePlayer = function(id,name,ev) {
    $mdDialog.show({
      controller: DeletePlayerPopupCtrl,
      templateUrl: 'dashboard/views/football/delete.player.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      locals:{
          playerId: id,
          playerName: name
          },
      clickOutsideToClose:true,
      fullscreen: true
    });
  };
  
  
    $scope.selectedSort = 'playerId';
    $scope.selectedRPP = "10";
     $scope.changedRPP = function(value){
         $scope.selectedRPP=value;  
     };
    $scope.allPlayersPromise=Football.getAllPlayers().then(function(Players){
      $scope.footPlayers = Players.data.data;
    });
    $scope.updatedPlayer={};
    $scope.updatedPlayer.active=false;
    $scope.EditPlayer=function(playerId){
      document.getElementById(playerId).children[1].style.display="none";
      document.getElementById(playerId).children[2].style.display="none";
      document.getElementById(playerId).children[3].style.display="table-cell";
      document.getElementById(playerId).children[4].style.display="table-cell";
      $scope.updatedPlayer.name=document.getElementById(playerId).children[1].innerHTML;
      if(document.getElementById(playerId).children[2].innerHTML=="false"){
      $scope.updatedPlayer.active=false;
            document.getElementById("statusBtn").className="btn btn-danger btn-trans waves-effect waves-danger w-md m-b-5";
      }
      else if(document.getElementById(playerId).children[2].innerHTML=="true"){
      $scope.updatedPlayer.active=true;
            document.getElementById("statusBtn").className="btn btn-success btn-trans waves-effect waves-success w-md m-b-5";
      
      }
      console.log($scope.updatedPlayer);
      document.getElementById(playerId).children[5].children[0].style.display="table-cell";
      document.getElementById(playerId).children[5].children[1].style.display="table-cell";
      document.getElementById(playerId).children[5].children[2].style.display="none";
      document.getElementById(playerId).children[5].children[3].style.display="none";
      document.getElementById(playerId).children[5].children[4].style.display="none";
    };
    
    $scope.cancelEdit=function(playerId){
      document.getElementById(playerId).children[1].style.display="table-cell";
      document.getElementById(playerId).children[2].style.display="table-cell";
      document.getElementById(playerId).children[3].style.display="none";
      document.getElementById(playerId).children[4].style.display="none";
      
      document.getElementById(playerId).children[5].children[0].style.display="none";
      document.getElementById(playerId).children[5].children[1].style.display="none";
      document.getElementById(playerId).children[5].children[2].style.display="inline";
      document.getElementById(playerId).children[5].children[3].style.display="inline";
      document.getElementById(playerId).children[5].children[4].style.display="inline";
        
    };
    $scope.clickedToggle=function(){
        console.log($scope.updatedPlayer.active);
        if($scope.updatedPlayer.active==true){
            $scope.updatedPlayer.active=false;
            document.getElementById("statusBtn").className="btn btn-danger btn-trans waves-effect waves-danger w-md m-b-5";
        }
        else if($scope.updatedPlayer.active==false){
            $scope.updatedPlayer.active=true;
            document.getElementById("statusBtn").className="btn btn-success btn-trans waves-effect waves-success w-md m-b-5";
        }
    };
    
    $scope.postEdited=function(player){
        player.name=$scope.updatedPlayer.name;
        player.active=$scope.updatedPlayer.active;
         $scope.updatePlayerPromise=Football.updatePlayer(player).then(function(res){
            $scope.cancelEdit(player.playerId);
            window.location.reload();
         });
    };
});
