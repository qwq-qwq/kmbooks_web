'use strict';

angular.module('angularApp')
  .controller('EditCtrl', function($scope, authorization, $rootScope) {
    $scope.username = authorization.username();

    $rootScope.$on('successful_authorization', function () {
      $scope.username = authorization.username();
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
