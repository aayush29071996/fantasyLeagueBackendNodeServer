/**
 * @Filename : upcomingController.js
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
 * @name termsAndConditionController
 * @description
 * 
 */

+ function(window, angular) {
    'use strict';
    angular
        .module("fandom")
        .registerCtrl('termsCtrl', termsCtrl);
    termsCtrl.$inject = ["$scope", "$rootScope", "$commons", "$logger", "fandomService", "exceptionService", "$window", "$filter"];


    function termsCtrl($scope, $rootScope, $commons, $logger, fandomService, exceptionService, $window, $filter) {

        $scope.initFunction = function() {

        };




        $scope.initFunction();

    }
}(window, angular);