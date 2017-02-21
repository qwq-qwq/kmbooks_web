/**
 * Created by sergey on 22.02.17.
 */

'use strict';

angular.module('angularApp').directive('bkAutoFocus', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    link : function(scope, $element) {
      scope.$watch('showSearch', function () {
        $timeout(function () {
          $element[0].focus();
        });
      })
    }
  }
}]);
