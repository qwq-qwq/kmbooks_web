'use strict';

angular.module('angularApp').directive('bkBookTail', [function() {
  return {
    restrict: 'E',
    scope: {
      book: '='
    },
    templateUrl: 'views/bk_book_tail.html'
  };
}])
