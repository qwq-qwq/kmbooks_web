/**
 * Created by sergey on 03.02.17.
 */

'use strict';

angular.module('angularApp')
  .controller('MyOrdersCtrl', function($scope, $http, $location, $anchorScroll, $route, config, authorization, utils) {
    $scope.username = authorization.username();

    $http.get(config.url() + "/api/orders/get_by_username?username=" + authorization.username())
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
