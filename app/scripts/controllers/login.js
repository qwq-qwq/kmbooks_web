'use strict';

angular.module('angularApp').controller('LoginCtrl', function (wishList, $scope, $location, $rootScope, $cookieStore, authorization) {

  $scope.login = function () {
    var credentials = {
      username: this.email,
      password: this.password
    };

    var success = function (data) {
      if (data.name) {
        $scope.error = false;
        $rootScope.authenticated = true;
        $rootScope.username = data.name;
        $rootScope.role = data.principal.role;
        wishList.GetStoredWishList();
        if (authorization.onlyIsUser()) {
          $location.path("/");
        }else{
          $location.path("/edit");
        }
      } else {
        $rootScope.authenticated = false;
        $rootScope.username = '';
        $rootScope.role = '';
        $location.path("/login");
        $scope.error = true;
      }
    };
    var error = function () {
      $rootScope.authenticated = false;
      $rootScope.username = '';
      $rootScope.role = '';
      $location.path("/login");
      $scope.error = true;
    };

    authorization.login(credentials).success(success).error(error);
  };

  $scope.logout = function() {
    var success = function (data) {
      $rootScope.authenticated = false;
      $rootScope.username = '';
      $rootScope.role = '';
      wishList.SetWishList({});
      $location.path("/");
    };
    var error = function () {
    };

    authorization.logout().success(success).error(error);
  }

});
