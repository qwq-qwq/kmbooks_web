'use strict';

angular.module('angularApp').directive('bkBookTail', [function() {
  return {
    restrict: 'E',
    scope: {
      book: '='
    },
    templateUrl: 'views/bk_book_tail.html',
    link: function(scope, element, attributes) {
      scope.wishHeart = 'fa fa-heart-o';
      scope.onMouseLeave = function () {
        scope.wishHeart = 'fa fa-heart-o';
      }
      scope.onMouseEnter = function () {
        scope.wishHeart = 'fa fa-heart';
      }

    }
  };
}])
