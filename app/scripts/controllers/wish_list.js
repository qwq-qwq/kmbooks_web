/**
 * Created by sergey on 04.02.17.
 */

'use strict';

angular.module('angularApp')
  .controller('WishListCtrl', function($scope, $http, $location, $anchorScroll, $route, config, authorization, utils) {
    $scope.username = authorization.username();

    $http.get(config.url() + "/api/user/wish_lists/get_by_username?username=" + authorization.username(), {withCredentials: true})
      .success(function(response) {
        $scope.wishList = response;
      })

    $scope.toDateTime = function(ObjId) {
      return utils.toDateTime(ObjId);
    }

  });
