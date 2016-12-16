'use strict';

angular.module('angularApp').directive('bkAfterCatalog', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    link: function($scope, element, attributes) {
      $scope.$on('menuloaded', function () {
         $timeout(function () {
           $.SmartMenus.Bootstrap.init();
         });
      })
    }
  };
}])
