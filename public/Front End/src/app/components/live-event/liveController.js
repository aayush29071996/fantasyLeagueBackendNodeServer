/**
 * @Filename : liveController.js
 * @Description : 
 * @Author : Patharraj
 * @Date : Oct 15, 2017 
 * 
 * @History
 *  Version     Date        Author        Remarks
 *  1.0         15-10-17    Patharraj     File Created         
 */

/**
 * @ngdoc controller
 * @name liveController
 * @description
 * 
 */

+ function(window, angular) {
    'use strict';
    angular
        .module("fandom")
        .registerCtrl('liveCtrl', liveCtrl);
    liveCtrl.$inject = ["$scope", "$rootScope", "$commons", "$logger", "fandomService", "exceptionService", "$window", "$filter"];


    function liveCtrl($scope, $rootScope, $commons, $logger, fandomService, exceptionService, $window, $filter) {

        $scope.initFunction = function() {
            $scope.matchDetails = JSON.parse(window.sessionStorage.match);
            $scope.userData = JSON.parse(window.sessionStorage.userDetail);
            $rootScope.loader = true;
            $scope.getLiveScore();
        };

        $scope.getLiveScore = function() {
            var url = $rootScope.appConfig.baseUrl + $rootScope.appConfig.getBoard + "/" + $scope.matchDetails.matchId;
            fandomService.get(url).then(function(res) {
                $rootScope.loader = false;
                if (res && res.data.status == "success") {
                    $scope.liveScore = res.data.data;
                    if ($scope.liveScore.length > 0) {
                        for (var i = 0; i < $scope.liveScore.length; i++) {
                            if ($scope.liveScore[i].user.username == $scope.userData.username) {
                                $scope.userScore = $scope.liveScore[i];
                            } else {
                                $scope.userScore = [];
                            }
                        }
                        $scope.noScore = false;
                    } else {
                        $scope.noScore = true;
                    }

                    if (angular.element('.float-refresh').hasClass('refresher')) {
                        angular.element('.float-refresh').removeClass('refresher');
                    }
                } else {
                    $commons.showError('#errorModal', res.data.error, true);
                }
            }, function(err) {
                $commons.showError('#errorModal', err, true);
            });
        };

        $scope.refreshLive = function() {
            angular.element('.float-refresh').addClass('refresher');
            $scope.getLiveScore();
        };


        $scope.$watch("liveChange", function() {
            if (window.sessionStorage.match !== $scope.matchDetails) {
                $scope.matchDetails = JSON.parse(window.sessionStorage.match);
                $rootScope.loader = true;
                $scope.getLiveScore();
            }
        });
        $scope.initFunction();

    }
}(window, angular);