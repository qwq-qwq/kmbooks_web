/**
 * Created by sergey on 03.02.17.
 */
'use strict';

angular.module('angularApp').directive('bkOrderGoodsTable', ['$http', 'config', 'authorization', '$location', function($http, config, authorization, $location) {
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
        var order = scope.order;
        if (order.goodsTable !== undefined){
          order.orderAmount = 0;
          angular.forEach(order.goodsTable, function(value, key) {
            if (value !== undefined) {
              if (value.priceWithoutDiscount === undefined){
                value.priceWithoutDiscount = value.price;
              }
              value.price = Math.round(value.priceWithoutDiscount * (1 - value.discount / 100) * 100) / 100;
              value.amount = Math.round(value.quantity * value.price * 100) / 100;
              order.orderAmount += value.amount;
            }
          });
          order.totalAmount = order.orderAmount + order.deliveryCost;
        }
      }

    }
  };
}])
