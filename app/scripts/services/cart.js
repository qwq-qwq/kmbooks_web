
'use strict';

angular.module('angularApp').factory('cart', function ($rootScope) {
  return {
    Cart: function () {
      return $rootScope.cart;
    },
    IsNotEmpty: function () {
      if ($rootScope.cart !== undefined){
        if ($rootScope.cart.length > 0){
          return true;
        }
      }
    },
    Items: function () {
      if ($rootScope.cart !== undefined) {
        return $rootScope.cart.length;
      }
    }
  }});
