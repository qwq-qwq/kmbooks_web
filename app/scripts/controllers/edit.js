'use strict';

angular.module('angularApp')
  .controller('EditCtrl', function($scope, authorization) {

    $scope.isAdmin = function() {
       return authorization.isAdmin();
    }

    $scope.isEditor = function() {
       return authorization.isEditor();
    }

  });
