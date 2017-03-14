'use strict';

angular.module('angularApp').directive('bkBookTail', ['wishList', '$mdPanel', '$http', 'config', 'authorization', 'confirmDialog',
  function(wishList, $mdPanel, $http, config, authorization, confirmDialog) {
  return {
    restrict: 'E',
    scope: {
      book: '='
    },
    templateUrl: 'views/bk_book_tail.html',
    link: function(scope, element, attributes) {

      if (scope.book !== undefined) {
        if (wishList.AlreadyInWishList(scope.book.code)) {
          scope.alreadyInWishList = true;
          scope.wishHeart = 'fa fa-heart brand-color-hover';
        }else{
          scope.alreadyInWishList = false;
          scope.wishHeart = 'fa fa-heart-o brand-color';
        }
      }

      scope.onMouseLeave = function () {
        if (!scope.alreadyInWishList) {
          scope.wishHeart = 'fa fa-heart-o brand-color';
        }else{
          scope.wishHeart = 'fa fa-heart brand-color-hover';
        }
      }
      scope.onMouseEnter = function () {
        scope.wishHeart = 'fa fa-heart brand-color-hover';
      }

      scope.$on('wish_list_has_added', function () {
        if (scope.book !== undefined) {
          if (wishList.AlreadyInWishList(scope.book.code)) {
            scope.alreadyInWishList = true;
            scope.wishHeart = 'fa fa-heart brand-color-hover';
          }else{
            scope.alreadyInWishList = false;
            scope.wishHeart = 'fa fa-heart-o brand-color';
          }
        }
      })

      scope.AddToWishList = function (book) {
        if (authorization.isAuthorized()) {
          var wishListItem = {username: authorization.username(), code: book.code, name: book.name};
          $http.post(config.url() + "/api/user/wish_lists/update", wishListItem, {withCredentials: true})
            .success(function (response) {
                wishList.SetWishList(response);
            })
        }else{
          confirmDialog.ShowRegistrationConfirm('Для того, щоб додавати товари в лист бажаннь вам необхідно зареєструватися');
        }
      }

    }
  };
}])
