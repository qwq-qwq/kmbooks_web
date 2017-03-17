/**
 * Created by sergey on 03.02.17.
 */

'use strict';

angular.module('angularApp')
  .controller('MyOrdersCtrl', function($scope, $http, $location, $anchorScroll, $route, config, authorization, utils, $rootScope) {
    $scope.username = authorization.username();

    $scope.refreshOrders = function () {
      $http.get(config.url() + "/api/user/orders/get_user_orders", {withCredentials: true})
        .success(function(response) {
          $scope.orders = response;
        })
    }

    $scope.refreshOrders();

    $rootScope.$on('successful_authorization', function () {
      $scope.username = authorization.username();
      $scope.refreshOrders();
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
          goodsPrices.push(parseFloat(goodsItem.price));
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
      var wayForPay = new Wayforpay();
      wayForPay.run({
          merchantAccount : "kmbooks_com_ua1",
          merchantDomainName : "kmbooks.com.ua",
          merchantTransactionSecureType: "AUTO",
          authorizationType : "SimpleSignature",
          merchantSignature : order.signature,
          orderReference : order.number + '-' + order.hash,
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
          clientPhone: '38' + order.phone
        },
        function (response) {
          // on approved
          $http.post(config.url() + "/api/orders/pay_confirm", response)
            .success(function(response) {
              $scope.refreshOrders();
            });
        },
        function (response) {
          // on declined
          //alert(response);
        },
        function (response) {
          // on pending or in processing
          $scope.refreshOrders();
        })
    }

    $scope.Pay = function (order) {
      order.hash = utils.GetRandomNumber();
      $http.post(config.url() + "/api/user/orders/get_order_signature", order, {withCredentials: true})
        .success(function (response) {
          order.signature = response;
          $scope.WayForPay(order)
        })
    }

    $rootScope.$on('wfp_window_events', function(a, b) {
       if (b.data === 'WfpWidgetEventApproved') {

       }
    });

  });
