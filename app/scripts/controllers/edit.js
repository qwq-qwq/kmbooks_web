'use strict';

angular.module('angularApp')
  .controller('EditCtrl', function($scope, authorization, $rootScope) {
    $scope.username = authorization.username();
    if (authorization.getUser() != undefined){
      $scope.valueOfPurchases = authorization.getUser().valueOfPurchases;
      $scope.stylePercent = {width: $scope.valueOfPurchases/1000*100 + "%"};
      $scope.progressBarPercent = Math.round($scope.valueOfPurchases/1000*100);
    }

    $rootScope.$on('successful_authorization', function () {
      $scope.username = authorization.username();
      $scope.valueOfPurchases = authorization.getUser().valueOfPurchases;
      $scope.stylePercent = {width: $scope.valueOfPurchases/1000*100 + "%"};
      $scope.progressBarPercent = Math.round($scope.valueOfPurchases/1000*100);
    })

    $scope.isAdmin = function() {
      return authorization.isAdmin();
    }

    $scope.isEditor = function() {
      return authorization.isEditor();
    }

    $scope.isOrdersAdmin = function() {
      return authorization.isOrdersAdmin();
    }

    $scope.isCopyWriter = function() {
      return authorization.isCopyWriter();
    }

    $scope.isUser = function() {
      return authorization.isUser();
    }

  });
