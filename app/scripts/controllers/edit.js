'use strict';

angular.module('angularApp')
  .controller('EditCtrl', function($scope, authorization) {

    $scope.init = function() {
      $scope.username = authorization.username();
    }

    $scope.isAdmin = function() {
       return authorization.isAdmin();
    }

    $scope.isEditor = function() {
       return authorization.isEditor();
    }

    $scope.isUser = function() {
      return authorization.isUser();
    }

  });
