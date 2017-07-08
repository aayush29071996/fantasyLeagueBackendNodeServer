angular.module('userCustCtrl',['dashServices'])
.controller('UserCust', function($scope,$window,Users){
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

  Users.getAllUsers().then(function(response){
   $scope.users=response.data.data;
   console.log($scope.users)
   $scope.userDob = moment($scope.users.createdOn).format('YYYY-MM-DD');

   // $scope.useDob=moment(response.data.createdOn);
   console.log($scope.userDob);
 });


});
