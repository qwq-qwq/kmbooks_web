/**
 * Created by sergey on 07.03.17.
 */
'use strict';

angular.module('angularApp').directive('bkPrice', [function() {
  return {
    restrict: 'E',
    templateUrl: 'views/bk_price.html',
    scope: {
      div: '=',
      book: '='
    }
  };
}])
