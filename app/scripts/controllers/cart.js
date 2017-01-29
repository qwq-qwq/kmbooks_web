'use strict';

angular.module('angularApp')
  .controller('CartCtrl', function($scope, $http, $location, config, cart, $rootScope, authorization) {
    $scope.cart = cart.Items();

    $http.get(config.url() + "/api/get_cities")
      .success(function(response) {
        $scope.cities = response;
        $scope.selector = {};
        $scope.selector.city = $scope.cities[0];
        $scope.SelectCity();
      })

    $scope.SelectCity = function () {
      var id = $scope.selector.city.id;
      $http.get(config.url() + "/api/get_city?id=" + id)
        .success(function(response) {
          $scope.selectedCity = response;
          $scope.selectedDelivery = $scope.selectedCity.delivery[0];
          $scope.selectedPayment = $scope.selectedDelivery.payments[0];
          $scope.SelectDelivery();
        })
    }

    $scope.SelectDelivery = function () {
      $scope.selectedPayment = $scope.selectedDelivery.payments[0];
      if ($scope.selectedDelivery.id === '5'){
        $scope.selectedNewPostWHS = $scope.selectedCity.newPostWHS[0];
      }else if ($scope.selectedDelivery.id === '3'){
        $scope.selectedShop = $scope.selectedCity.shops[0];
      }
    }

    $scope.SelectPayment = function () {
      //var index = $scope.selector.paymentIndex;
      //$scope.selectedPayment = $scope.selectedDelivery.payments[index];
    }

    $scope.SelectNewPostWHS = function () {
      //var index = $scope.selector.newPostWHSIndex;
      //$scope.selectedNewPostWHS = $scope.selectedCity.newPostWHS[index];
    }

    $scope.CartRecalculation = function () {
      if ($scope.cart !== undefined) {
        var orderAmount = 0;
        angular.forEach($scope.cart.goodsTable, function(value, key) {
          if (value !== undefined) {
            value.amount = value.quantity * value.price;
            orderAmount += value.amount;
          }
        });
        $scope.cart.orderAmount = orderAmount;
        if (authorization.isAuthorized()) {
          $http.post(config.url() + "/api/edit/carts/update", $scope.cart, {withCredentials: true})
            .success(function(response) {
              $rootScope.cart = response;
              $scope.$emit('cart_was_added');
            })
        }else{
          $http.post(config.url() + "/api/carts/update", $scope.cart)
            .success(function(response) {
              $rootScope.cart = response;
              $scope.$emit('cart_was_added');
            })
        }
      }
    }

    $scope.ChangeQuantity = function () {
      $scope.CartRecalculation();
    }

    $scope.removeFromCart = function (code) {
      angular.forEach($scope.cart.goodsTable, function(value, key) {
        if (value.code === code) {
          $scope.cart.goodsTable.splice(key, 1);
        }
      });
      $scope.CartRecalculation();
    }

    $scope.CartRecalculation();

  })


