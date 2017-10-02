/**
 * Created by sergey on 20.09.17.
 */
'use strict';

angular.module('angularApp').directive('bkWishListUserList', [function() {
  return {
    restrict: 'E',
    scope: {
      usersList: '='
    },
    templateUrl: 'views/bk_wish_list_user_list.html'
  }
}]);
