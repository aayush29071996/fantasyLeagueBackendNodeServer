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
 * @name profileController
 * @description
 * 
 */

+ function(window, angular) {
    'use strict';
    angular
        .module("fandom")
        .registerCtrl('profileCtrl', profileCtrl);
    profileCtrl.$inject = ["$scope", "$rootScope", "$commons", "$logger", "fandomService", "exceptionService", "$window", "$filter"];


    function profileCtrl($scope, $rootScope, $commons, $logger, fandomService, exceptionService, $window, $filter) {

        $scope.initFunction = function() {
            $scope.userData = JSON.parse(window.sessionStorage.userDetail);
            $scope.getPLayerHistory();
        };


        $scope.getPLayerHistory = function() {
            var url = $rootScope.appConfig.baseUrl + $rootScope.appConfig.getLeaderBoard + "/" + $scope.userData.username;
            fandomService.get(url).then(function(res) {
                if (res && res.data.status == "success") {
                    $scope.profile = res.data.data;
                    console.log($scope.profile);
                } else {
                    $commons.showError('#errorModal', res.data.error, true);
                }
            }, function(err) {
                $commons.showError('#errorModal', err, true);
            });
        };


        $scope.initFunction();

    }
}(window, angular);