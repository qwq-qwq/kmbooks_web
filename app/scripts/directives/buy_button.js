'use strict';

angular.module('angularApp').directive('bkBuyButton', ['$http', 'config', 'authorization', '$rootScope', '$location', function($http, config, authorization, $rootScope, $location) {
  return {
    restrict: 'E',
    scope: {
      book: '=',
      cart: '='
    },
    templateUrl: 'views/bk_buy_button.html',
    link: function(scope, element, attributes) {
      scope.AddToCart = function(book) {
        if (authorization.isAuthorized()) {
          if ($rootScope.cart !== null){
            var cart = {email: authorization.username(), goodsTable: {}}
          }
          var goodsTable = {code: book.code, quantity: 1, price: book.price}
          cart.goodsTable = goodsTable;
          $http.post(config.url() + "/api/edit/carts/update", cart, {withCredentials: true})
            .success(function(response) {
               $rootScope.cart = response;
               scope.$emit('cart_was_added');
            })
        }else{
          if ($rootScope.cart !== null){
            var cart = {email: authorization.username(), goodsTable: []}
          }
          var goodsTable = {code: book.code, quantity: 1, price: book.price}
          cart.goodsTable.push(goodsTable);
          $http.post(config.url() + "/api/carts/update", cart)
            .success(function(response) {
               $rootScope.cart = response;
               scope.$emit('cart_was_added');
            })
        }
        return 0;
      }

    }
  };
}])
