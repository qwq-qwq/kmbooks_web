/**
 * Created by sergey on 15.02.17.
 */

'use strict';

angular.module('angularApp')
  .controller('OrdersCtrl', function($scope, $http, $location, $route, config, authorization, utils, $rootScope) {
    $scope.username = authorization.username();
    $scope.orderStates = ['Робиться', 'Зроблений', 'Підтверджено', 'Зібраний', 'Сплачений'];
    $scope.selectors = {};
    $scope.dateEnd = new Date(new Date().getTime() + 1 * 1000 * 60 * 60 * 24); //taking tomorrow date for covering current day
    $scope.dateStart = new Date($scope.dateEnd - 10 * 1000 * 60 * 60 * 24);

    $rootScope.$on('successful_authorization', function () {
      $scope.username = authorization.username();
    })

    $scope.editItem = function (item) {
      item.editing = true;
      $scope.selectors.orderState = item.orderState;
      $scope.selectors.admComment = item.admComment;
      angular.forEach($scope.orderPayments, function (payment, key) {
         if (payment.id === item.payment.id){
           $scope.selectors.payment = payment;
         }
      })
    }


    $scope.doneEditing = function (item) {
      item.orderState = $scope.selectors.orderState;
      item.admComment = $scope.selectors.admComment;
      item.payment = $scope.selectors.payment;
      item.saving = true;
      $http.post(config.url() + "/api/orders_admin/orders/update", item, {withCredentials: true})
        .success(function(response) {
           item.saving = false;
           item.editing = false;
           item.savedSuccess = true;
           item.savedError = false;
           $scope.currentOrder = response;
        })
        .error(function () {
           item.saving = false;
           item.savedSuccess = false;
           item.savedError = true;
        });
    }

    $scope.updateOrdersTable = function () {
      var link = '';
      var dateStart, dateEnd;
      dateStart = $scope.dateStart.getDate().toString() + "." + ("0" +($scope.dateStart.getMonth() + 1).toString()).slice(-2) + "." + $scope.dateStart.getFullYear().toString();
      dateEnd = $scope.dateEnd.getDate().toString() + "." + ("0" +($scope.dateEnd.getMonth() + 1).toString()).slice(-2) + "." + $scope.dateEnd.getFullYear().toString();
      if ($scope.dateStart && $scope.dateEnd) {
        link = "dateStart=" + dateStart + "&dateEnd=" + dateEnd;
      }
      $http.get(config.url() + "/api/orders_admin/orders?" + link, {withCredentials: true})
        .success(function (response) {
          $scope.requests_author = response;
          for(var k in response) {
            var grandTotal = 0;
            angular.forEach(response, function (value, key) {
              grandTotal += value.totalAmount;
            });
            $scope.orders = response;
            $scope.grandTotal = grandTotal;
          };
        })
      $http.get(config.url() + "/api/get_payment_types")
        .success(function (response) {
           $scope.orderPayments = response;
        })
    }

    $scope.updateOrdersTable();

    $scope.toDateTime = function(ObjId) {
      return utils.toDateTime(ObjId);
    }

    $scope.setGoodsTable = function (order){
      angular.forEach($scope.orders, function (value, key) {
        if(value.number === order.number){
           value.active = (value.active === undefined)? true : !value.active;
        }else{
           value.active = false;
        }
      });
      //$scope.goodsTable = order.goodsTable;
      $scope.currentOrder = order;
      $http.get(config.url() + "/api/get_city?originalId=" + order.cityId)
        .success(function(response) {
          $scope.selectedCity = response;
        })
      $http.get(config.url() + "/api/check_user_exist?email=" + order.email)
        .then(function successCallback(response) {
          if (response.data){
            order.userNowExist = true;
          }else{
            order.userNowExist = false;
          }
        }, function errorCallback(response) {
          order.userNowExist = false;
        })
    }

  });
