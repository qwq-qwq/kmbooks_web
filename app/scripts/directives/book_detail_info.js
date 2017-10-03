/**
 * Created by sergey on 17.02.17.
 */
'use strict';

angular.module('angularApp').directive('bkBookDetailInfo', [function() {
  return {
    restrict: 'E',
    scope: {
      book: '='
    },
    templateUrl: 'views/bk_book_detail_info.html'
  };
}])
