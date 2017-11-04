/**
 * @Filename : helpers.js
 * @Description :
 * @Author : 
 * @Date : Oct 14, 2017
 * 
 * @History
 *  Version     Date          Author        Remarks
 *  1.0         14-10-2017    Patharraj     File Created
 */

+ function(window, angular) {

    'use strict';
    angular.module('helpers', [])
        .factory('$helpers', helpers);

    function helpers($injector, $window, $logger, $rootScope, $timeout, fandomService, $q, $filter) {

        /**
         * Initialise generic instance
         * @type {{}}
         */
        var fn = {};

        /* Create Instance for Logger */
        var logger = $logger.getInstance("$helpers");

        /**
         * progress bar utility
         * usage :
         *         $helpers.progress.show(tagetElement);
         *         $helpers.progress.hide(tagetElement);
         *         $helpers.progress.display(tagetElement,timeout,callback);
         *
         * @type {{show: Function, hide: Function, display: Function}}
         */
        fn.progress = {
            parse: function(element) {
                angular.isString(element) && (element = angular.element('#' + element));
                return element;
            },
            show: function(element) {
                var self = this;
                element = self.parse(element);
                element && ((angular.element(element).length > 0), true);
            },
            hide: function(element) {
                var self = this;
                element = self.parse(element);
                element && ((angular.element(element).length > 0), false);
            },
            display: function(element, timeout, callback) {
                var self = this;
                element = self.parse(element);
                (timeout = (timeout || 0)),
                element && (((angular.element(element).length > 0) &&
                    (kendo.ui.progress(angular.element(element), true), (function() {
                        $timeout(function() {
                            kendo.ui.progress(angular.element(element), false);
                            (callback || angular.noop)();
                        }, timeout);
                    })())));
            }
        }


        /**
         * Speed up calls to hasOwnProperty
         * @type {Function}
         */
        var hasOwnProperty = Object.prototype.hasOwnProperty;

        return fn;
    }

}(window, angular);