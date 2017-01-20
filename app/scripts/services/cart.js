
'use strict';

angular.module('angularApp').factory('cart', function ($rootScope) {
  return {
    Items: function () {
      return $rootScope.cart;
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
