
'use strict';

angular.module('angularApp').factory('cart', function ($http, $rootScope, config, authorization) {
  return {
    GetCart: function () {
      return $rootScope.cart;
    },
    AlreadyInCart: function (code) {
      if ($rootScope.cart !== undefined) {
        var result = false;
        angular.forEach($rootScope.cart.goodsTable, function (value, key) {
          if (value.code === code) {
            result = true;
          }
        });
        return result;
      }else{
        return false;
      }
    },
    Exist: function () {
      if ($rootScope.cart === undefined) {
        return false;
      }else{
        return true;
      }
    },
    SetCart: function (cart) {
      var orderAmount = 0;
      if (cart.goodsTable !== undefined){
        angular.forEach(cart.goodsTable, function(value, key) {
          if (value !== undefined) {
            value.amount = Math.round(value.quantity * value.price * 100) / 100;
            orderAmount += value.amount;
          }
        });
      }
      cart.orderAmount = Math.round(orderAmount * 100) / 100;
      $rootScope.cart = cart;
      $rootScope.$broadcast('cart_was_added');
    },
    RemoveFromCart: function (code) {
      angular.forEach($rootScope.cart.goodsTable, function(value, key) {
        if (value.code === code) {
          $rootScope.cart.goodsTable.splice(key, 1);
        }
      });
    },
    AddToGoodsTable: function (Item) {
      $rootScope.cart.goodsTable.push(Item);
    },
    IsNotEmpty: function () {
      if ($rootScope.cart !== undefined){
        if ($rootScope.cart.goodsTable.length > 0){
          return true;
        }else{
          return false;
        }
      }else{
        return false;
      }
    },
    ItemsCount: function () {
      if ($rootScope.cart !== undefined) {
        return $rootScope.cart.goodsTable.length;
      }
    }
  }});
