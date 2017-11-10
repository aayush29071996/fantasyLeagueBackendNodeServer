angular.module('userCustCtrl',['dashServices'])
.controller('UserCust', function($scope,$window,Users, $mdDialog,moment){
  new Morris.Line({
    element: 'myfirstchart',
    data: [
      { x: '17/05', value: 4015 },
      { x: '18/05', value: 4556 },
      { x: '19/05', value: 5485 },
      { x: '20/05', value: 6755 },
      { x: '21/05', value: 8451 }
    ],
    xkey: ['x'],
    ykeys: ['value'],
    parseTime: false,
    labels: ['Users']
  });
  new Morris.Line({
    element: 'mysecondchart',
    data: [
      { x: '17/05', value: 3115 },
      { x: '18/05', value: 2056 },
      { x: '19/05', value: 2485 },
      { x: '20/05', value: 3755 },
      { x: '21/05', value: 4461 }
    ],
    xkey: ['x'],
    labels:['Date'],
    ykeys: ['value'],
    parseTime: false,
    labels: ['Users']
  });
  new Morris.Line({
    element: 'mythirdchart',
    data: [
      { week: '1', value: 3115 },
      { week: '2', value: 2056 },
      { week: '3', value: 2485 },
      { week: '4', value: 4755 },
      { week: '5', value: 6651 }
    ],
    xkey: ['week'],
    ykeys: ['value'],
    parseTime: false,
    labels: ['Users']
  });


  function ViewMatchCardsPopupCtrl($scope,$mdDialog,Users,user){
     
     $scope.close=function(){
         $mdDialog.hide();
     };

     $scope.ViewMatchCardsPromise = Users.getMatchCards(user._id).then(function(res){
              res=res.data.data;
              $scope.userMatchCards = res;
              $scope.user = user;
              $scope.returnIST = function(date){
                return moment(date).utcOffset('+0530').format('YYYY-MM-DD HH:mm');
              };
              $scope.returnTotalUserPoints = function(index){
                var points = 0;
                $scope.userMatchCards[index].matchCard.players.forEach(function(player, playerIndex){
                  points = points + player.points;
                    if(playerIndex == $scope.userMatchCards[index].matchCard.players.length - 1){
                      return points;
                    } 
                });
              };
              $scope.userPlayerSet = $scope.userMatchCards[0].matchCard.players;
              $scope.selectedMatchCardIndex = 0;
              $scope.viewPlayerSet = function(index){
                   $scope.userPlayerSet = $scope.userMatchCards[index].matchCard.players;
                   $scope.selectedMatchCardIndex = index;
              };
              $scope.isMatchCardSelected = function(index){
                var weight = index == $scope.selectedMatchCardIndex ? '700' : '300'
                return {'font-weight':weight}
              }
              $scope.playerSort = 'positionId';
              $scope.matchCardSort = 'startingDateTime';


        }).catch(function(e){
      });
  };


  Users.getAllUsers().then(function(response){
   $scope.users=response.data.data;
   // console.log($scope.users)
   $scope.userDob = moment($scope.users.createdOn).format('YYYY-MM-DD');
   // console.log($scope.userDob);
 });

 $scope.viewMatchCards = function(user,ev) {
    $mdDialog.show({
      controller: ViewMatchCardsPopupCtrl,
      templateUrl: 'dashboard/views/users/view.customer.matchcards.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      locals:{
          user: user
          },
      clickOutsideToClose:true,
      fullscreen: true
    });
  };

});
