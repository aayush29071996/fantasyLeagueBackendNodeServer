/**
 * @Filename : pointController.js
 * @Description : 
 * @Author : Patharraj
 * @Date : Oct 21, 2017 
 * 
 * @History
 *  Version     Date        Author        Remarks
 *  1.0         21-10-17    Patharraj     File Created         
 */

/**
 * @ngdoc controller
 * @name termsAndConditionController
 * @description
 * 
 */

+ function(window, angular) {
    'use strict';
    angular
        .module("fandom")
        .registerCtrl('pointCtrl', pointCtrl);
    pointCtrl.$inject = ["$scope", "$rootScope", "$commons", "$logger", "fandomService", "exceptionService", "$window", "$filter"];


    function pointCtrl($scope, $rootScope, $commons, $logger, fandomService, exceptionService, $window, $filter) {

        $scope.initFunction = function() {

        };




        $scope.initFunction();

    }
}(window, angular);