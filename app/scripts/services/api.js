'use strict';

angular.module('angularApp').factory('api', function (utils, wishList, cart, order, $http, $location,
                                                      $rootScope, $cookies, authorization, elBooks) {
  return {
    init: function () {
      $http.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
      var success = function (data) {
        if (data.email) {
          $rootScope.authenticated = true;
          $rootScope.user = data;
          $rootScope.username = data.email;
          $rootScope.role = data.role;
          wishList.GetStoredWishList();
          elBooks.SetElBooks(data.elBooks);
          $rootScope.$broadcast('successful_authorization');
        } else {
          $rootScope.authenticated = false;
        }
      };
      authorization.login().success(success);
      order.GetStoredData();
      utils.GetRandomColorSchemes();
    },
    checkOnConfigRights: function () {
       if(!authorization.canAccessToAdminPart()){
         $location.url('/login');
       }
    }
  };
});
