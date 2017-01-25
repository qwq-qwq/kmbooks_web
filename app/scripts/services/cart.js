
'use strict';

angular.module('angularApp').factory('cart', function ($rootScope) {
  return {
    Items: function () {
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
    IsNotEmpty: function () {
      if ($rootScope.cart !== undefined){
        if ($rootScope.cart.goodsTable.length > 0){
          return true;
        }
      }
    },
    ItemsCount: function () {
      if ($rootScope.cart !== undefined) {
        return $rootScope.cart.goodsTable.length;
      }
    }
  }});
