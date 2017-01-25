'use strict';

angular.module('angularApp').directive('bkBuyButton', ['$http', 'config', 'authorization', '$rootScope', 'cart', function($http, config, authorization, $rootScope, cart) {
  return {
    restrict: 'E',
    scope: {
      book: '='
    },
    templateUrl: 'views/bk_buy_button.html',
    link: function(scope, element, attributes) {
      scope.$watch('book', function () {
        if (scope.book !== undefined) {
          if ([1227, 2008].indexOf(scope.book.state) === -1) {
            if (scope.book.kvo > 0) {
              scope.boughtText = "Купити";
              scope.boughtDisable = false;
            } else {
              scope.boughtText = "Замовити";
              scope.boughtDisable = false;
            }
          } else {
            scope.boughtText = "Купити";
            scope.boughtDisable = true;
          }
          if (cart.AlreadyInCart(scope.book.code)){
            scope.boughtText = "У кошику";
            scope.boughtDisable = true;
          }
        }
      })
      scope.AddToCart = function(book) {
        if ($rootScope.cart === undefined){
          $rootScope.cart = {email: authorization.username(), goodsTable: []}
        }
        var preorder = scope.book.kvo > 0 ? false: true;
        var goodsTable = {code: book.code, quantity: 1, price: book.price, discount: 0, name: book.name, preorder: preorder}
        $rootScope.cart.goodsTable.push(goodsTable);
        if (authorization.isAuthorized()) {
          $http.post(config.url() + "/api/edit/carts/update", $rootScope.cart, {withCredentials: true})
            .success(function(response) {
               scope.boughtText = "У кошику";
               scope.boughtDisable = true;
               $rootScope.cart = response;
               scope.$emit('cart_was_added');
            })
        }else{
          $http.post(config.url() + "/api/carts/update", $rootScope.cart)
            .success(function(response) {
               scope.boughtText = "У кошику";
               scope.boughtDisable = true;
               $rootScope.cart = response;
               scope.$emit('cart_was_added');
            })
        }
        return 0;
      }

    }
  };
}])
