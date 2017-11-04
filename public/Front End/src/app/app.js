/**
 * @Filename : app.js
 * @Description :
 * @Author : 
 * @Date : Oct 14, 2017
 * 
 * @History
 *  Version     Date          Author        Remarks
 *  1.0         14-10-2017    Patharraj     File Created
 */

angular.module("fandom", [
    "ui.router",
    "ngCookies",
    "logger",
    "helpers",
    "angularMoment",
    "720kb.datepicker",
    "naif.base64",
    "720kb.socialshare"
]).config([
    "$stateProvider", "$urlRouterProvider", "$locationProvider", "$controllerProvider", "$provide",
    function($stateProvider, $urlRouterProvider, $locationProvider, $controllerProvider, $provide) {
        "use strict";
        //To set the environment prod/dev
        // var env="prod";
        var env = "dev";


        $urlRouterProvider.otherwise("/layout/dashboard");
        angular.module("fandom").registerCtrl = $controllerProvider.register;
        /*    $httpProvider.defaults.cache = !0;
            $httpProvider.defaults.withCredentials = true;

            $httpProvider.defaults.headers.post["Content-Type"] = "application/json; charset=utf-8";*/


        function loadScript(path) {
            var result = $.Deferred(),
                script = document.createElement("script");
            script.async = "async";
            script.type = "text/javascript";
            if (env == "prod")
                path = path + "-min.js";
            else
                path = path + ".js";
            script.src = path;
            script.onload = script.onreadystatechange = function(_, isAbort) {
                if (!script.readyState || /loaded|complete/.test(script.readyState)) {
                    if (isAbort)
                        result.reject();
                    else
                        result.resolve();
                }
            };
            script.onerror = function() {
                result.reject();
            };
            document.querySelector("head").appendChild(script);
            return result.promise();
        }

        function loader(arrayName) {
            return {
                load: function($q) {
                    var deferred = $q.defer(),
                        map = arrayName.map(function(name) {
                            return loadScript(name);
                        });

                    $q.all(map).then(function(r) {
                        deferred.resolve();
                    });

                    return deferred.promise;
                }
            };
        }

        /*
         * State provider for this application.
         */
        $stateProvider
            .state("layout", {
                url: "/layout",
                templateUrl: "app/components/layout/layout.html",
                resolve: loader(["scripts/components/layout/layoutController", "scripts/components/distributed/popupModalController"]),
                controller: "layoutController"
            })
            .state("layout.dashboard", {
                url: "/dashboard",
                templateUrl: "app/components/dashboard/dashboard.html",
                resolve: loader(["scripts/components/dashboard/dashboardController"]),
                controller: "dashboardCtrl"
            })
            .state("layout.upcoming", {
                url: "/upcoming",
                templateUrl: "app/components/upcoming-event/upcoming.html",
                resolve: loader(["scripts/components/upcoming-event/upcomingController"]),
                controller: "upcomingCtrl"
            })
            .state("layout.live", {
                url: "/live",
                templateUrl: "app/components/live-event/live.html",
                resolve: loader(["scripts/components/live-event/liveController"]),
                controller: "liveCtrl"
            }).state("layout.history", {
                url: "/history",
                templateUrl: "app/components/history-event/history.html",
                resolve: loader(["scripts/components/history-event/historyController"]),
                controller: "historyCtrl"
            })
            .state("layout.profile", {
                url: "/profile",
                templateUrl: "app/components/settings/profile/profile.html",
                resolve: loader(["scripts/components/settings/profile/profileController"]),
                controller: "profileCtrl"
            }).state("layout.terms", {
                url: "/terms",
                templateUrl: "app/components/settings/termsAndCondition/termsAndCondition.html",
                resolve: loader(["scripts/components/settings/termsAndCondition/termsAndConditionController"]),
                controller: "termsCtrl"
            }).state("layout.rules", {
                url: "/rules",
                templateUrl: "app/components/settings/rulesAndRegulation/rules.html",
                resolve: loader(["scripts/components/settings/rulesAndRegulation/rulesController"]),
                controller: "rulesCtrl"
            }).state("layout.contact", {
                url: "/contact",
                templateUrl: "app/components/settings/contact/contact.html",
                resolve: loader(["scripts/components/settings/contact/contactController"]),
                controller: "contactCtrl"
            }).state("layout.store", {
                url: "/store",
                templateUrl: "app/components/settings/store/store.html",
                resolve: loader(["scripts/components/settings/store/storeController"]),
                controller: "storeCtrl"
            }).state("layout.points", {
                url: "/points",
                templateUrl: "app/components/settings/points/points.html",
                resolve: loader(["scripts/components/settings/points/pointsController"]),
                controller: "pointCtrl"
            }).state("layout.setting", {
                url: "/setting",
                templateUrl: "app/components/settings/setting/setting.html",
                resolve: loader(["scripts/components/settings/setting/settingController"]),
                controller: "settingCtrl"
            });
    }
]).run(config).filter('slice', function() {
    return function(arr, start, end) {
        return (arr || []).slice(start, end);
    };
}).directive('countdown', [
    'Util',
    '$interval',
    function(Util, $interval) {
        return {
            restrict: 'A',
            scope: { date: '@' },
            link: function(scope, element) {
                var future;
                future = new Date(scope.date);
                var timericon = "<i class=\"icon ion-ios-stopwatch-outline\"><\/i>&nbsp;"
                $interval(function() {
                    var diff;
                    diff = Math.floor((future.getTime() - new Date().getTime()) / 1000);
                    return element.html(timericon + Util.dhms(diff));
                }, 1000);
            }
        };
    }
]).factory('Util', [function() {
    return {
        dhms: function(t) {
            var days, hours, minutes, seconds;
            days = Math.floor(t / 86400);
            t -= days * 86400;
            hours = Math.floor(t / 3600) % 24;
            t -= hours * 3600;
            minutes = Math.floor(t / 60) % 60;
            t -= minutes * 60;
            seconds = t % 60;
            if (hours < 10)
                hours = "0" + hours;

            if (minutes < 10)
                minutes = "0" + minutes;

            if (seconds < 10)
                seconds = "0" + seconds;
            if (days == 0) {
                if (hours == 0) {
                    if (minutes == 0) {
                        return [
                            seconds + ''
                        ].join('');
                    } else {
                        return [
                            minutes + ':',
                            seconds + ''
                        ].join('');
                    }
                } else {
                    return [
                        hours + ':',
                        minutes + ':',
                        seconds + ''
                    ].join('');
                }
            } else {
                return [
                    days + 'D:',
                    hours + ':',
                    minutes + ':',
                    seconds + ''
                ].join('');
            }
        }
    };
}]);;

function config($rootScope, $state, $window, $http) {
    "use strict";

    //Load config details from config/config.json
    $http.get('config/config.json')
        .then(function(data, status, headers, config) {
            $rootScope.appConfig = data.data;

        }, function(data, status, headers, config) {

        });

    //scroll page to top if route change
    $rootScope.$on('$viewContentLoaded', function() {
        $(window).scrollTop(0);
    });

    // $rootScope.appConfig = appConfig;
}
angular.module("fandom").filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        if (input)
            return input.slice(start);
    }
});