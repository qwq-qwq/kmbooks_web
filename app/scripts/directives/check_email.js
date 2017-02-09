/**
 * Created by sergey on 09.02.17.
 */
'use strict';

angular.module('angularApp').directive('bkCheckEmail', '$http', 'config', [function($http, config) {
  return {
    restrict: 'A',
    require: "ngModel",
    scope: {
      email: '='
    },
    link: function(scope, element, attributes, ngModel) {
      ngModel.$validators.checkEmailUnique = function(modelValue) {
        return modelValue == scope.otherValueToCompare;
      };

      scope.$watch("otherValueToCompare", function() {
        ngModel.$validate();
      });}
  };
}])
