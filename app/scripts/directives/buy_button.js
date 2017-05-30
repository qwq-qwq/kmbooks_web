'use strict';

angular.module('angularApp').directive('bkBuyButton', ['$http', 'config', 'authorization', '$rootScope',
'cart', '$location', function($http, config, authorization, $rootScope, cart, $location) {
  return {
    restrict: 'E',
    scope: {
      book: '='
    },
    templateUrl: 'views/bk_buy_button.html',
    link: function(scope, element, attributes) {

      function updateStatus() {
        if (scope.book !== undefined) {
          if ([1227, 2008].indexOf(scope.book.state) === -1) {
            if ($location.path().search('book') != -1 && !authorization.isAuthorized()) {
              scope.discountHint = "<span class='brand-color'>РЕЄСТРУЙТЕСЬ</span> та відразу отримайте <br> ЗНИЖКУ <span class='brand-color'>3%</span>";
            }else{
              scope.discountHint = "";
            };
            if (scope.book.kvo > 0) {
              scope.boughtText = "Купити";
              scope.boughtDisable = false;
              scope.boughtHint = "";
            } else {
              scope.boughtText = "Замовити";
              scope.boughtDisable = false;
              scope.boughtHint = "Книга очікується з друку"
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
      }

      scope.$watch('book', function () {
        updateStatus();
      })

      scope.$on('cart_was_added', function () {
        updateStatus();
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
        cart.AddToGoodsTable({code: book.code, quantity: 1, price: book.price, discount: book.discount, name: book.name, preorder: preorder});

        if (authorization.isAuthorized()) {
          $http.post(config.url() + "/api/user/carts/update", cart.GetCart(), {withCredentials: true})
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
