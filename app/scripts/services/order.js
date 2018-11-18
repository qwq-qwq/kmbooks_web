
'use strict';

angular.module('angularApp').factory('order', function (authorization, cart, config, $rootScope, $http, $cookies) {
  return {
    GetOrder: function () {
      return $rootScope.order;
    },
    Exist: function () {
      if ($rootScope.order === undefined){
        return false;
      }else{
        return true;
      }
    },
    SetOrder: function (order) {
      return $rootScope.order = order;
    },
    AlreadyInOrder: function (code) {
      if ($rootScope.order !== undefined) {
        var result = false;
        angular.forEach($rootScope.order.goodsTable, function (value, key) {
          if (value.code === code) {
            result = true;
          }
        });
        return result;
      }else{
        return false;
      }
    },
    IsNotEmpty: function () {
      if ($rootScope.order !== undefined){
        if ($rootScope.order.goodsTable.length > 0){
          return true;
        }
      }
    },
    ItemsCount: function () {
      if ($rootScope.order !== undefined) {
        return $rootScope.order.goodsTable.length;
      }
    },
    GetStoredOrderData: function () {
      var orderId = $cookies.get('orderId');
      if (orderId !== undefined){
        if (orderId.length > 0){
          $http.get(config.url() + "/api/orders/get_order_by_id?id=" + orderId)
            .success(function(response) {
              $rootScope.order = response;
              if (response === ''){
                $rootScope.order = undefined;
              }
              if ($rootScope.order !== undefined) {
                if (!cart.Exist()){
                  cart.SetCart({email: authorization.username(), goodsTable: $rootScope.order.goodsTable});
                }
              }
            })
        }
      }
    },
    RecalculateOrder: function(order){
      if (order.goodsTable !== undefined){
        order.orderAmount = 0;
        angular.forEach(order.goodsTable, function(value, key) {
          if (value !== undefined) {
            if (value.priceWithoutDiscount === undefined){
              value.priceWithoutDiscount = value.price;
            }
            value.price = Math.round(value.priceWithoutDiscount * (1 - value.discount / 100) * 10) / 10;
            value.amount = Math.round(value.quantity * value.price * 100) / 100;
            order.orderAmount += value.amount;
          }
        });
        order.totalAmount = order.orderAmount + order.deliveryCost;
      }
    },
    RecalculateDeliveryCost: function (order) {
      var orderAmount = order.orderAmount;
      if (order.delivery.id === '1') {
        if (order.orderAmount >= 1000) {
          order.deliveryCost = 0;
        } else {
          order.deliveryCost = 40;
        }
      }else if (order.delivery.id === '3'){
        order.deliveryCost = 0;
      }else if (order.delivery.id === '5'){
        if (orderAmount >= 1000) {
          order.deliveryCost = 0;
        } else {
          order.deliveryCost = 45;
        }
      }else if(order.delivery.id === '4') {
        order.deliveryCost = 0;
        //if ((orderAmount >= 800) || (order.selectedCity.originalId === config.interDeliveryID())) {
        //  order.deliveryCost = 0;
        //} else {
        //  order.deliveryCost = 35;
        //}
      }
      order.totalAmount = orderAmount + order.deliveryCost;
    }
  }});
