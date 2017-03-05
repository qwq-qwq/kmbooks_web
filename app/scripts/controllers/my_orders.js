/**
 * Created by sergey on 03.02.17.
 */

'use strict';

angular.module('angularApp')
  .controller('MyOrdersCtrl', function($scope, $http, $location, $anchorScroll, $route, config, authorization, utils, $rootScope) {
    $scope.username = authorization.username();
    var wayForPay = new Wayforpay();

    $rootScope.$on('successful_authorization', function () {
      $scope.username = authorization.username();
      $http.get(config.url() + "/api/user/orders/get_by_username?username=" + $scope.username, {withCredentials: true})
        .success(function(response) {
          $scope.orders = response;
        })
    })

    $scope.toDateTime = function(ObjId) {
      return utils.toDateTime(ObjId);
    }

    $scope.setGoodsTable = function (order){
      $scope.goodsTable = order.goodsTable;
      $scope.currentOrder = order;
    }

    $scope.WayForPay = function (order) {
      function getGoodsNames(goodsTable) {
        var goodsNames = [];
        angular.forEach(goodsTable, function (goodsItem, key) {
          goodsNames.push(goodsItem.name);
        })
        return goodsNames;
      }
      function getGoodsPrices(goodsTable) {
        var goodsPrices = [];
        angular.forEach(goodsTable, function (goodsItem, key) {
          goodsPrices.push(parseInt(goodsItem.price, 10));
        })
        return goodsPrices;
      }
      function getGoodsCounts(goodsTable) {
        var goodsCounts = [];
        angular.forEach(goodsTable, function (goodsItem, key) {
          goodsCounts.push(parseInt(goodsItem.quantity, 10));
        })
        return goodsCounts;
      }
      wayForPay.run({
          merchantAccount : "kmbooks_com_ua1",
          merchantDomainName : "www.kmbooks.com.ua",
          authorizationType : "SimpleSignature",
          merchantSignature : order.signature,
          orderReference : order.number,
          orderDate : utils.toUnixTime(order.id),
          amount : order.totalAmount,
          currency : "UAH",
          language: "UA",
          productName: getGoodsNames(order.goodsTable),
          productPrice: getGoodsPrices(order.goodsTable),
          productCount: getGoodsCounts(order.goodsTable),
          clientFirstName : order.name,
          clientLastName : order.name,
          clientEmail : order.email,
          clientPhone: order.phone
        },
        function (response) {
          // on approved
          alert(response);
        },
        function (response) {
          // on declined
          alert(response);
        },
        function (response) {
          // on pending or in processing
          alert(response);
        })
    }

    $scope.Pay = function (order) {
      $http.post(config.url() + "/api/user/orders/get_order_signature", order, {withCredentials: true})
        .success(function (response) {
          order.signature = response;
          $scope.WayForPay(order)
        })
    }

  });
