'use strict';


var dashControllers = angular.module('dashControllers', ['dashServices']);


dashControllers.controller('mainController', function($scope, Api,$window){
 
 Api.whoAmI();
    $scope.logout=function() {
        Api.logoutUser();
    }
});

dashControllers.controller('homeController', function () {


    });
    
    
