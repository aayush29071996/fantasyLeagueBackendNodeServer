
+ function (window, angular, undefined) {


    angular.module("fandom-grid-header", ["fandom-app", "fandom"])
        .factory('$headers', kendoGridHeaderFactory);

    function kendoGridHeaderFactory($logger, $rootScope, appConfig) {
        var fn = {};
        return fn;
    }

}(window, window.angular);