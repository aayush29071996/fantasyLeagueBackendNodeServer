/**
 * @Filename : rules.js
 * @Description : 
 * @Author : Patharraj
 * @Date : Oct 15, 2017 
 * 
 * @History
 *  Version     Date        Author        Remarks
 *  1.0         19-10-17    Patharraj     File Created         
 */

/**
 * @ngdoc controller
 * @name rulesController
 * @description
 * 
 */

+ function(window, angular) {
    'use strict';
    angular
        .module("fandom")
        .registerCtrl('rulesCtrl', rulesCtrl);
    rulesCtrl.$inject = ["$scope", "$rootScope", "$commons", "$logger", "fandomService", "exceptionService", "$window", "$filter"];


    function rulesCtrl($scope, $rootScope, $commons, $logger, fandomService, exceptionService, $window, $filter) {

        $scope.initFunction = function() {
            $scope.privacyTab = "rules";
        };

        $scope.navigateTab = function(taName) {
            $scope.privacyTab = taName;
        };

        $scope.activetab = function(tabNum) {
            return $scope.privacyTab === tabNum;
        };



        $scope.initFunction();

    }
}(window, angular);