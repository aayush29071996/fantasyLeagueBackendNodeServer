/**
 * @Filename : factory.js
 * @Description : Factory Function
 * @Author : Patharraj
 * @Date : Oct 14, 2017
 * 
 * @History
 *  Version     Date          Author        Remarks
 *  1.0         14-10-2017    Patharraj     File Created
 */

/**
 * @ngdoc factory
 * @name factory
 * @description
 * 
 */

function TokenInterceptor($q, $window, $rootScope, $location, $injector) {

    return {
        request: function(config) {
            // using to send loged in user token
            config.headers = config.headers || {};
            if ($window.sessionStorage.authToken) {
                config.headers.Authorization = $window.sessionStorage.authToken;
            }
            return config;
        },
        // using to check what is the excet error response we are getting from server
        responseError: function(rejection) {
            var accessToken = $injector.get('accessToken');
            var $http = $injector.get('$http');
            var $helpers = $injector.get('$helpers');
            // using to differentiate the error and show the message to modal popup. 
            if (rejection.status == 401 || rejection.status == -1) {

                var rejectionUrl = rejection.config.url;
                if (rejectionUrl != ($rootScope.appConfig.customerBaseUrl + $rootScope.appConfig.logError)) {
                    $window.sessionStorage.APIstatus = 401;
                    var apiUrl = rejection.config.url;
                    var apiUrlArr = apiUrl.split("/");
                    var apiUrlArrLen = apiUrlArr.length;
                    if (apiUrlArr[apiUrlArrLen - 1] == 'getnewaccesstoken') {
                        $window.sessionStorage.refreshToken = null;
                        $window.sessionStorage.authToken = null;
                        $window.location = "#/login";
                    }
                }
            }
            if (rejection.status == 404) {}
            if (rejection.status == 500) {}
            return $q.reject(rejection);
        },
        response: function(response) {
            $window.sessionStorage.APIstatus = false;
            return response || $q.when(response);
        }
    };
}

function accessToken(fandomService, $rootScope, $injector, modalFactory, $q, $window) {
    var service = {};
    var exceptionService = $injector.get('exceptionService');
    service.getToken = function() {
        var deferred = $q.defer();
        if ($window.sessionStorage.tokenAPI == 'accessToken') {
            var url = $rootScope.appConfig.customerBaseUrl + $rootScope.appConfig.getNewAccessToken;
            var model = {
                "userName": $window.sessionStorage.username || '',
                "refreshToken": $window.sessionStorage.refreshToken || null
            };
            $rootScope.newTokenCalled = true;
        } else {
            var url = $rootScope.appConfig.customerBaseUrl + $rootScope.appConfig.getAccessToken;
            var model = {
                "userName": $window.sessionStorage.username || ''
            };
            $window.sessionStorage.tokenAPI = 'accessToken';
        }

        fandomService.post(url, model).then(function(res) {
            //logger.info("URL: " + url + ", Response Data Length: " + res.data.length);
            if (res.success) {
                $window.sessionStorage.authToken = res.accessToken;
                if (res.refreshToken) {
                    $window.sessionStorage.refreshToken = res.refreshToken;
                }
                deferred.resolve();
            } else {
                exceptionService.promiseRejectsAfterAWhile(res);

                deferred.reject();
            }
        }, function(err, status) {
            if ($window.sessionStorage.tokenAPI == 'newAccessToken') {
                $window.sessionStorage.tokenAPI = null;
                $window.sessionStorage.refreshToken = null;
                $window.sessionStorage.authToken = null;
                $window.location = "#/login";
            }
            (err != null) ? err: err = {}
            err.status = status;
            exceptionService.promiseRejectsAfterAWhile(err);
            deferred.reject();
        }).finally(function() {});
        return deferred.promise;
    };
    return service;
}

function modalFactory($uibModal) {
    var factories = {};
    factories.errorModal = function(params) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'modal-skeleton.html',
            controller: 'modalInstanceController',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function() {
                    return params;
                }
            }
        });
        return modalInstance;
    };

    factories.gridModal = function(params) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'modal-grid-skeleton.html',
            controller: 'gridModalInstanceController',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function() {
                    return params;
                }
            }
        });
        return modalInstance;
    };

    return factories;
}

function exceptionService($q, $http, $timeout) {

    // The throwsAnError function throws an error.
    function throwsAnError(text) {
        throw new Error(text);
    }

    // The promiseRejectsAfterAWhile function returns a promise that... rejects after a while.
    function promiseRejectsAfterAWhile(err) {

        var defer = $q.defer();

        $timeout(function() {
            defer.reject(err);
        }, 500);

        return defer.promise;
    }

    // Provide a small description for each method for even better error messages.
    // throwsAnError.description = 'perform the blablabla synchronous operation';
    // promiseRejectsAfterAWhile.description = 'perform some blablabla asynchronous operation';

    return {
        throwsAnError: throwsAnError,
        promiseRejectsAfterAWhile: promiseRejectsAfterAWhile
    };
}

// using to show all messages in modal popup
function fandomAlert($uibModal) {
    var service = {};
    service.open = function(templateUrl, alert_header, alert_message, isdelete, entity, viewId, isremove, size) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: templateUrl,
            controller: "alertModalContentCtrl",
            windowClass: "common-alertpopups",
            size: size,
            backdrop: 'static',
            resolve: {
                alert_model: function() {
                    return {
                        alert_header: alert_header,
                        alert_message: alert_message,
                        isdelete: isdelete,
                        entity: entity,
                        viewId: viewId,
                        isremove: isremove
                    };
                }
            }
        });
    };
    return service;
}


angular.module('fandom')
    .factory('TokenInterceptor', TokenInterceptor)
    .factory('modalFactory', modalFactory)
    .factory('exceptionService', exceptionService)
    .factory('accessToken', accessToken)
    .factory('fandomAlert', fandomAlert)