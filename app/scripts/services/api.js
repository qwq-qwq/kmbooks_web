'use strict';

angular.module('angularApp').factory('api', function (utils, wishList, cart, order, $http, $rootScope, $cookies, authorization, elBooks) {
  return {
    init: function () {
      $http.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
      var success = function (data) {
        if (data.email) {
          $rootScope.authenticated = true;
          $rootScope.user = data;
          $rootScope.username = data.email;
          $rootScope.role = data.role;
          $rootScope.$broadcast('successful_authorization');
          wishList.GetStoredWishList();
          elBooks.SetElBooks(data.elBooks);
        } else {
          $rootScope.authenticated = false;
        }
      };
      authorization.login().success(success);
      order.GetStoredData();
      utils.GetRandomColorSchemes();
    }
  };
});
