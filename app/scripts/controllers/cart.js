'use strict';

angular.module('angularApp')
  .controller('CartCtrl', function($scope, $http, $location, config, cart, $rootScope, authorization) {
    $scope.cart = cart.Items();

    $http.get(config.url() + "/api/get_cities")
      .success(function(response) {
        $rootScope.cities = response;
      })

    $scope.SelectCity = function () {
      var id = $scope.selector.cityId;
      $http.get(config.url() + "/api/get_city?id=" + id)
        .success(function(response) {
          $rootScope.selectedCity = response;
        })
    }

    $scope.SelectDelivery = function () {
      var index = $scope.selector.deliveryIndex;
      $rootScope.selectedDelivery = $scope.selectedCity.delivery[index];
    }

    $scope.SelectPayment = function () {
      var index = $scope.selector.paymentIndex;
      $rootScope.selectedPayment = $scope.selectedDelivery.payments[index];
    }

    $scope.SelectNewPostWHS = function () {
      var index = $scope.selector.newPostWHSIndex;
      $rootScope.selectednewPostWHS = $scope.selectedCity.newPostWHS[index];
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


