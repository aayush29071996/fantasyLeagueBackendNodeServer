/**
 * @Filename : dashboardController.js
 * @Description : 
 * @Author : Patharraj
 * @Date : Oct 14, 2017 
 * 
 * @History
 *  Version     Date        Author        Remarks
 *  1.0         14-10-17    Patharraj     File Created         
 */

/**
 * @ngdoc controller
 * @name dashboardCtrl
 * @description
 * 
 */

+ function(window, angular) {
    'use strict';
    angular
        .module("fandom")
        .registerCtrl('dashboardCtrl', dashboardCtrl)
    dashboardCtrl.$inject = ["$scope", "$rootScope"];


    function dashboardCtrl($scope, $rootScope) {
        $scope.initFunction = function() {

        };

        $scope.initFunction();
    }
}(window, angular);