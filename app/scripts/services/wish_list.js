/**
 * Created by sergey on 05.02.17.
 */

'use strict';

angular.module('angularApp').factory('wishList', function ($http, $rootScope, config, authorization) {
  return {
    GetWishList: function () {
      return $rootScope.wishList;
    },
    AlreadyInWishList: function (code) {
      if ($rootScope.wishList !== undefined) {
        var result = false;
        angular.forEach($rootScope.wishList, function (value, key) {
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
      if ($rootScope.wishList === undefined){
        return false;
      }else{
        return true;
      }
    },
    SetWishList: function (wishList) {
      $rootScope.wishList = wishList;
      $rootScope.$broadcast('wish_list_has_added');
    },
    IsNotEmpty: function () {
      if ($rootScope.wishList !== undefined){
        if ($rootScope.wishList.length > 0){
          return true;
        }else{
          return false;
        }
      }else{
        return false;
      }
    },
    ItemsCount: function () {
      if ($rootScope.wishList !== undefined) {
        return $rootScope.wishList.length;
      }
    },
    GetStoredWishList: function () {
      var username = authorization.username();
      if (username !== undefined){
        if (username.length > 0){
          $http.get(config.url() + "/api/user/wish_lists/get_by_username?username=" + username, {withCredentials: true})
            .success(function(response) {
              $rootScope.wishList = response;
              $rootScope.$broadcast('wish_list_has_added');
            })
        }
      }
    }

  }});
