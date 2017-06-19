'use strict';


var dashControllers = angular.module('dashControllers', ['dashServices']);

dashControllers.controller('Login', function ($scope, Auth, $state, $timeout) {
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


dashControllers.controller('FootFixtures', function($scope, Football, Auth, $state, $timeout, moment) {
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
