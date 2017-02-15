/**
 * Created by sergey on 15.02.17.
 */

'use strict';

angular.module('angularApp')
  .controller('OrdersCtrl', function($scope, $http, $location, $anchorScroll, $route, config, authorization, utils) {
    $scope.username = authorization.username();

    $http.get(config.url() + "/api/edit/orders", {withCredentials: true})
      .success(function(response) {
        $scope.orders = response;
      })

    $scope.toDateTime = function(ObjId) {
      return utils.toDateTime(ObjId);
    }

    $scope.setGoodsTable = function (order){
      $scope.goodsTable = order.goodsTable;
      $scope.currentOrder = order;
    }
  });
