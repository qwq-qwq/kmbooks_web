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
        function successAdded(response) {
          scope.boughtText = "У кошику";
          scope.boughtDisable = true;
          cart.SetCart(response);
        }
        if (!cart.Exist()){
          cart.SetCart({email: authorization.username(), goodsTable: []});
        }
        var preorder = scope.book.kvo > 0 ? false: true;
        cart.AddToGoodsTable({code: book.code, quantity: 1, price: book.price, discount: 0, name: book.name, preorder: preorder});

        if (authorization.isAuthorized()) {
          $http.post(config.url() + "/api/edit/carts/update", cart.GetCart(), {withCredentials: true})
            .success(function(response) {
              successAdded(response);
            })
        }else{
          $http.post(config.url() + "/api/carts/update", cart.GetCart())
            .success(function(response) {
              successAdded(response);
            })
        }
        return 0;
      }

    }
  };
}])
