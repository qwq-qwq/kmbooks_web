
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
    }
  }});
