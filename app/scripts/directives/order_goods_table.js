/**
 * Created by sergey on 03.02.17.
 */
'use strict';

angular.module('angularApp').directive('bkOrderGoodsTable', ['$http', 'config', 'authorization', '$location', 'order', function($http, config, authorization, $location, order) {
  return {
    restrict: 'E',
    scope: {
      order: '='
    },
    templateUrl: 'views/bk_order_goods_table.html',
    link: function(scope, element, attributes) {
      //scope.$watch('order', function () {
      //  scope.proceedSearch = true;
      //})
      scope.RecalculationOrder = function () {
        order.RecalculateOrder(scope.order);
        order.RecalculateDeliveryCost(scope.order);
      }

      scope.addToCart = function (code) {
        scope.order.addingItem = true;
        $http.get(config.url() + '/api/books/search?code=' + code)
          .success(function (response) {
            var book = response.bookList[0];
            var goodsTableItem = {
              code: book.code,
              quantity: 1,
              price: book.price,
              discount: 0,
              name: book.name,
              preorder: false
            };
            scope.order.goodsTable.push(goodsTableItem);
            scope.RecalculationOrder();
            scope.order.addingItem = false;
          })
          .error(function () {
            scope.order.addingItem = false;
          })
      }

      scope.removeFromCart = function (code) {
        var order = scope.order;
        angular.forEach(order.goodsTable, function(value, key) {
          if (value.code === code) {
            order.goodsTable.splice(key, 1);
            scope.RecalculationOrder();
            return;
          }
        });
      }

    }
  };
}])
