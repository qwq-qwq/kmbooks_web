/**
 * Created by sergey on 15.02.17.
 */

'use strict';

angular.module('angularApp')
  .controller('OrdersCtrl', function($scope, $http, $location, $route, config, authorization, utils, $rootScope) {
    $scope.username = authorization.username();
    $scope.orderStates = ['Робиться', 'Зроблений', 'Підтверджено', 'Зібраний', 'Сплачений'];
    $scope.selectors = {};

    $rootScope.$on('successful_authorization', function () {
      $scope.username = authorization.username();
    })

    $scope.editItem = function (item) {
      item.editing = true;
      $scope.selectors.orderState = item.orderState;
    }

    $scope.doneEditing = function (item) {
      item.orderState = $scope.selectors.orderState;
      item.saving = true;
      $http.post(config.url() + "/api/orders_admin/orders/update", item, {withCredentials: true})
        .success(function(response) {
           item.saving = false;
           item.editing = false;
           $scope.currentOrder = response;
        });
    }

    $http.get(config.url() + "/api/orders_admin/orders", {withCredentials: true})//
      .success(function(response) {
        $scope.orders = response;
      })//

    $scope.toDateTime = function(ObjId) {
      return utils.toDateTime(ObjId);
    }

    $scope.setGoodsTable = function (order){
      $scope.goodsTable = order.goodsTable;
      $scope.currentOrder = order;
      $http.get(config.url() + "/api/get_city?originalId=" + order.cityId)
        .success(function(response) {
          $scope.selectedCity = response;
        })
    }
  });
