/**
 * @Filename : directive.js
 * @Description : Directive
 * @Author : Patharraj
 * @Date : Oct 14, 2017
 * 
 * @History
 *  Version     Date          Author        Remarks
 *  1.0         14-10-2017    Patharraj     File Created
 */

/**
 * @ngdoc directive
 * @name directive
 * @description
 * 
 */

function sampleDirective($window) {
    return function(scope, element, attrs) {};
};

function colorpicker() {
    return {
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModel) {
            elem.spectrum();
            if (!ngModel) return;
            ngModel.$render = function() {
                elem.spectrum('set', ngModel.$viewValue || '#fff');
            };
            elem.on('change', function() {
                scope.$apply(function() {
                    ngModel.$setViewValue(elem.val());
                });
            });
        }
    }
};

/**
 * @ngdoc Number Input Directive
 * @name Number
 * @description Stop Add String in input field
 * 
 */

function numberInput() {
    return {
        require: '?ngModel',
        link: function(scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                var transformedInput = text.replace(/[^0-9]/g, '');
                if (transformedInput !== text) {
                    ngModelCtrl.$setViewValue(transformedInput);
                    ngModelCtrl.$render();
                }
                return transformedInput; // or return Number(transformedInput)
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    }
};

angular
    .module('fandom')
    .directive('sampleDirective', sampleDirective)
    .directive('colorpicker', colorpicker)
    .directive('numberInput', numberInput);