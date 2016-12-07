'use strict';

angular.module('angularApp').directive('bkCompareTo', [function() {
  return {
    restrict: 'A',
    require: "ngModel",
    scope: {
       otherValueToCompare: '=bkCompareTo'
    },
    link: function(scope, element, attributes, ngModel) {
      ngModel.$validators.compareTo = function(modelValue) {
        return modelValue == scope.otherValueToCompare;
      };

      scope.$watch("otherValueToCompare", function() {
        ngModel.$validate();
      });}
  };
}])
