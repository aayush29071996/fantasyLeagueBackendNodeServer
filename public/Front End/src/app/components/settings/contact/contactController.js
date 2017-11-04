/**
 * @Filename : contactController.js
 * @Description : 
 * @Author : Patharraj
 * @Date : Oct 15, 2017 
 * 
 * @History
 *  Version     Date        Author        Remarks
 *  1.0         20-10-17    Patharraj     File Created         
 */

/**
 * @ngdoc controller
 * @name contactController
 * @description
 * 
 */

+ function(window, angular) {
    'use strict';
    angular
        .module("fandom")
        .registerCtrl('contactCtrl', contactCtrl);
    contactCtrl.$inject = ["$scope", "$rootScope", "$commons", "$logger", "fandomService", "exceptionService", "$window", "$filter"];


    function contactCtrl($scope, $rootScope, $commons, $logger, fandomService, exceptionService, $window, $filter) {

        $scope.initFunction = function() {
            $scope.report = {
                "name": "",
                "email": "",
                "content": "",
                "subject": ""
            };
            $scope.reportDrop = false;
            $scope.suggestSubmit = false;
        };

        $scope.openReport = function(report) {
            if (report == "suggest") {
                $scope.report.subject = "feature";
                $scope.title = "Suggest and Feature";
            } else {
                $scope.report.subject = "report";
                $scope.title = "Report a problem";
            }
            angular.element('.contact-popup').addClass('active');
            $scope.reportDrop = true;
        };

        $scope.closeReport = function() {
            angular.element('.contact-popup').removeClass('active');
            $scope.reportDrop = false;
            $scope.report = {
                "name": "",
                "email": "",
                "content": "",
                "subject": ""
            };
            $scope.suggestSubmit = false;
        };


        $scope.suggestReport = function(valid) {
            $scope.suggestSubmit = true;
            if (valid) {
                $rootScope.loader = true;
                var url = $rootScope.appConfig.baseUrl + $rootScope.appConfig.report;
                fandomService.post(url, $scope.report).then(function(res) {
                    $rootScope.loader = false;
                    if (res && res.data.status == "success") {
                        $commons.showSuccess('#successModal', "Successfully Send A Email !", true);
                        $scope.closeReport();
                    } else {
                        $commons.showError('#errorModal', res.data.error, true);
                    }
                }, function(err) {
                    $commons.showError('#errorModal', err, true);
                });
            }
        };

        $scope.initFunction();

    }
}(window, angular);