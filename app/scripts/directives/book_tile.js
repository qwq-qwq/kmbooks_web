'use strict';

angular.module('angularApp').directive('bkBookTail', ['$http', 'config', 'authorization', function($http, config, authorization) {
  return {
    restrict: 'E',
    scope: {
      book: '='
    },
    templateUrl: 'views/bk_book_tail.html',
    link: function(scope, element, attributes) {
      scope.wishHeart = 'fa fa-heart-o brand-color';
      scope.onMouseLeave = function () {
        scope.wishHeart = 'fa fa-heart-o brand-color';
      }
      scope.onMouseEnter = function () {
        scope.wishHeart = 'fa fa-heart brand-color-hover';
      }
      /*scope.AddToWishList = function (book) {
        $http.post(config.url() + "/api/user/carts/update", cart.GetCart(), {withCredentials: true})
          .success(function(response) {
            successAdded(response);
          })
      }else{

      }*/
    }
  };
}])
