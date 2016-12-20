'use strict';

angular.module('angularApp').directive('bkPagination', [function() {
  return {
    restrict: 'E',
    templateUrl: 'views/bk_pagination.html'
  };
}])
