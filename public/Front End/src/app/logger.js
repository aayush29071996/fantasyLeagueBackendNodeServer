/**
 * @Filename : logger.js
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

    angular.module('logger', []).provider('$logger', [function() {

        var isEnabled = true;
        /*
         enable or disable logging. default option true.
         */
        this.enabled = function(_isEnabled) {
            isEnabled = !!_isEnabled;
        };
        /*
         This is a service to write logs to console and it's derived from angular default $logProvider.
         Register a service factory, which will be called to return the service instance. 
         This is short for registering a service where its provider consists of
         only a $get property, which is the given service factory function. You should use $provide.factory(getFn) 
         if you do not need to configure your service in a provider.

         Syntax : $provide.provider(name, {$get: $getFn}).
         name - Name of the provider
         $getFn - factory service function
         */
        this.$get = ['$log', '$window', '$rootScope', '$http', function($log, $window, $rootScope, $http) {
            /*
             Create Log Instance
             */
            var $logger = function(context) {
                this.context = context;
            };

            $logger.getInstance = function(context) {
                return new $logger(context);
            };

            $logger.formatter = function(str, o) {
                return str.replace(
                    /\{([^{}]*)\}/g,
                    function(a, b) {
                        var r = o[b];
                        return angular.isString(r) || angular.isNumber(r) ? r : a;
                    }
                );
            };
            /*
             arrange or put into a format , which will provide you (HH:MM:SS:MI) format string.

             date - date object
             */
            $logger.getFormattedTimestamp = function(date) {
                return $logger.formatter('{0}:{1}:{2}:{3}', [
                    date.getHours(),
                    date.getMinutes(),
                    date.getSeconds(),
                    date.getMilliseconds()
                ]);
            };
            /*
             *   Javascript doesn't have inheritance in the usual sense, but it has the prototype chain. prototype chain can be technically extended as long as you want,
             *   each time by setting the prototype of the subclass equal to an object of the parent class. I just extend her the $logger object chain.
             */
            $logger.prototype = {
                /*
                 This customized method will call internally built in $logProvider methods such as log, info, warn, debug and error.
                 */
                _log: function(originalFn, args) {
                    var self = this;
                    if (!isEnabled) {
                        return;
                    }
                    /* Get formatted time stamp string */
                    var now = $logger.getFormattedTimestamp(new Date());
                    var message = '',
                        formatterData = [];
                    switch (args.length) {
                        case 1:
                            message = $logger.formatter("{0} - {1}: {2}", [now, this.context, args[0]]);
                            break;
                        case 2:
                            if (angular.isString(args[1])) {
                                message = $logger.formatter("{0} - {1}::{2}(\'{3}\')", [now, this.context, args[0], args[1]]);
                            } else {
                                formatterData = args[1];
                                message = $logger.formatter("{0} - {1}: {2}", [now, this.context, args[0]]);
                            }
                            break;
                        case 3:
                            formatterData = args[2];
                            message = $logger.formatter("{0} - {1}::{2}(\'{3}\')", [now, this.context, args[0], args[1]]);
                            break;
                    }

                    var logType = "";
                    var logInBrowser = false;
                    var logInServer = false;

                    //api logging is enabled only when logType is set to DEBUG, if INFO it will be only logged in browser.
                    if ($window.sessionStorage && $window.sessionStorage.logType) {
                        logType = $window.sessionStorage.logType;
                        if (logType === "info" || logType === "INFO") {
                            logInBrowser = true;
                        }
                        if (logType === "debug" || logType === "DEBUG") {
                            logInBrowser = true;
                            logInServer = true;
                        }
                    }

                    //log && error are always logged in browser
                    if (originalFn == "log" || originalFn == "error" || originalFn == "info") {
                        logInBrowser = true;
                    }

                    if (logInBrowser === true) {
                        $log[originalFn].call(null, $logger.formatter(message, formatterData));
                    }

                    // if (logInServer) {
                    //     if ($window.sessionStorage.cou_seq && $window.sessionStorage.cou_seq!="undefined") {
                    //         var model = {
                    //             cuoSeq: parseInt($window.sessionStorage.cou_seq),
                    //             locale: $window.sessionStorage.locale,
                    //             logType: originalFn,
                    //             msg: message
                    //         };
                    //         var serviceUrl = $rootScope.appConfig.baseUrl + $rootScope.appConfig.logError;
                    //         $http.post(serviceUrl, model).then(function (succ) {
                    //             //self._log('info', succ);
                    //         }, function (err) {
                    //             //self._log('error', err); //enabling this will create a never ending loop
                    //         });
                    //     }
                    // }
                },
                /*
                 For general output of logging information. You may use string substitution and additional arguments with this method.
                 */
                log: function() {
                    this._log('log', arguments);
                },
                /*
                 Informative logging information. You may use string substitution and additional arguments with this method.
                 */
                info: function() {
                    this._log('info', arguments);
                },
                /*
                 Outputs a warning message. You may use string substitution and additional arguments with this method.
                 */
                warn: function() {
                    this._log('warn', arguments);
                },
                /**
                 For at least IE, Firefox and Chrome consoles, .debug() is just an alias for .log() added for improved compatibility
                 **/
                debug: function() {
                    this._log('debug', arguments);
                },
                /*
                 Outputs an error message. You may use string substitution and additional arguments with this method.
                 */
                error: function() {
                    this._log('error', arguments);

                }

            };
            return $logger;
        }];
    }]);
}(window, angular);