'use strict';

angular.module('angularApp').factory('api', function (cart, order, $http, $rootScope, $cookies, authorization) {
  return {
    init: function () {
      $http.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
      var success = function (data) {
        if (data.name) {
          $rootScope.authenticated = true;
          $rootScope.username = data.name;
          $rootScope.role = data.principal.role;
        } else {
          $rootScope.authenticated = false;
        }
      };
      authorization.login().success(success);
      order.GetStoredOrderData();
    }
  };
});
