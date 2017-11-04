/**
 * @Filename : fandomService.js
 * @Description : 
 * @Author : Patharraj
 * @Date : Oct 14, 2017
 * 
 * @History
 *  Version     Date          Author        Remarks
 *  1.0         14-10-2017    Patharraj     File Created
 */

/**
 * @ngdoc service
 * @name fandomService
 * @description
 * 
 */

+ function(window, angular) {
    'use strict';
    angular
        .module('fandom')
        .service('fandomService', fandomService);

    function fandomService($http, $logger, $rootScope, $q, $state, $window) {
        var logger = $logger.getInstance();

        // using to put api Service (Post Method)
        var put = function(url, model) {
            return $http.put(url, model).then(function(success) {
                return success;
            }, function(error) {
                return error;
            });
        };

        // using to post api Service (Post Method)
        var post = function(url, model) {
            return $http.post(url, model).then(function(success) {
                return success;
            }, function(error) {
                return error;
            });
        };

        // using to post empty api Service (Post Method without model )
        var getToken = function() {
            var deferred = $q.defer();
            if ($window.sessionStorage.tokenAPI == 'accessToken') {
                var url = $rootScope.appConfig.baseUrl + $rootScope.appConfig.getNewAccessToken;
                var model = {
                    "userName": $window.sessionStorage.username || '',
                    "refreshToken": $window.sessionStorage.refreshToken || null
                };
                $rootScope.newTokenCalled = true;
            } else {
                var url = $rootScope.appConfig.baseUrl + $rootScope.appConfig.getAccessToken;
                var model = {
                    "userName": $window.sessionStorage.username || ''
                };
                $window.sessionStorage.tokenAPI = 'accessToken';
            }

            $http.post(url, model).success(function(res) {
                //logger.info("URL: " + url + ", Response Data Length: " + res.data.length);
                if (res.success) {
                    $window.sessionStorage.authToken = res.accessToken;
                    if (res.refreshToken) {
                        $window.sessionStorage.refreshToken = res.refreshToken;
                    }
                    $rootScope.newTokenCalled = false;
                    deferred.resolve();
                } else {
                    var params = alertMessage.get('responseErrorAPI');
                    var modalInstance = modalFactory.errorModal(params);
                    deferred.reject();
                }
            }).error(function(err) {
                if ($window.sessionStorage.tokenAPI == 'newAccessToken') {
                    $window.sessionStorage.tokenAPI = null;
                    $window.sessionStorage.refreshToken = null;
                    $window.sessionStorage.authToken = null;
                    $window.location = "#/login";
                }
                deferred.reject();
            }).finally(function() {});
            return deferred.promise;
        };

        // using to post empty api Service (Post Method without model )
        var postEmpty = function(url) {
            var response = $http.post(url);
            return response;
        };

        // using to get api Service (get Method)
        var get = function(url) {
            return $http.get(url).then(function(success) {
                return success;
            }, function(error) {
                return error;
            });
        };

        // using to delete api Service(delete Method)
        var deleteApi = function(url) {
            return $http.delete(url).then(function(success) {
                return success;
            }, function(error) {
                return error;
            });
        };


        //using to return all service method to controller
        return {
            put: put,
            post: post,
            get: get,
            postEmpty: postEmpty,
            delete: deleteApi
        };
    }

}(window, angular);

+

function(window, angular) {
    'use strict';
    angular
        .module('fandom')
        .service('fandomNavigateService', fandomNavigateService);

    function fandomNavigateService($http, $logger, $window, $state, $rootScope, $filter) {
        var logger = $logger.getInstance();
        var currentParam = [];
        var pageList = [];
        var data = {};

        var setCurrentPage = function(page) {
            pageList = $window.sessionStorage.pageHistory ? JSON.parse($window.sessionStorage.pageHistory) : [];
            var currPage = {
                pageName: page.pageName,
                params: page.params
            }

            var previousState = pageList[pageList.length - 1];

            if (previousState && previousState.pageName == page.pageName && previousState.params == page.params) {} else {
                pageList.push(currPage);
            }

            $window.sessionStorage.pageHistory = null;
            $window.sessionStorage.pageHistory = JSON.stringify(pageList);

        }

        var Cancel = function() {
            pageList = $window.sessionStorage.pageHistory ? JSON.parse($window.sessionStorage.pageHistory) : [];
            var currentPage = pageList[pageList.length - 1];
            pageList.splice(-1, 1);
            var previousPage = pageList[pageList.length - 1];
            $window.sessionStorage.data = previousPage.params || null;
            $window.sessionStorage.pageHistory = null;
            $window.sessionStorage.pageHistory = JSON.stringify(pageList);
            if (currentPage && previousPage && (previousPage.pageName == currentPage.pageName)) {
                $state.go(previousPage.pageName, previousPage.params, {
                    reload: true
                });
            } else {
                $state.go(previousPage.pageName, previousPage.params);
            }
        }

        return {
            Cancel: Cancel,
            setCurrentPage: setCurrentPage
        };
    }
}(window, angular);