'use strict';

angular.module('angularApp').controller('LoginCtrl', function (wishList, $scope, $location, $rootScope, $cookieStore, authorization, $window) {

  $window.scrollTo(0, 0);

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
        $rootScope.user = data.principal.user;
        wishList.GetStoredWishList();
        $rootScope.$broadcast('successful_authorization');
        if (authorization.onlyIsUser()) {
          $location.path("/");
        }else{
          $location.path("/edit");
        }
      } else {
        $rootScope.authenticated = false;
        $rootScope.username = '';
        $rootScope.role = '';
        $rootScope.user = undefined;
        $location.path("/login");
        $scope.error = true;
      }
    };
    var error = function () {
      $rootScope.authenticated = false;
      $rootScope.username = '';
      $rootScope.role = '';
      $rootScope.user = undefined;
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
      wishList.SetWishList(undefined);
      $location.path("/");
    };
    var error = function () {
    };

    authorization.logout().success(success).error(error);
  }

});
