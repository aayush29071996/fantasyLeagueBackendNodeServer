+ function(window, angular) {
    'use strict';
    angular
        .module('fandom')
        .registerCtrl('alertModalContentCtrl', alertModalContentCtrl);

    /**
     * @ngdoc controller
     * @name alertModalContentCtrl
     * @description
     * Modal Instance controller is used for showing alert messages or informations in a popup. Actions are performed based on the user's input.
     */

    alertModalContentCtrl.$inject = ["$scope", "$commons", "$state", "$rootScope", "$window"];

    function alertModalContentCtrl($scope, $commons, $state, $rootScope, $window) {


    }
}(window, angular);