
'use strict';


angular.module('angularApp')
  .controller('UpdateByCallCtrl', function($scope, $http, config, authorization) {

    $scope.updateCatalog = function() {
       if (confirm("Оновити ?")) {
        $http.get(config.url() + "/api/edit/update_catalog", {withCredentials: true})
          .success(function (response) {
          })
      }
    }

    $scope.updateDescription = function() {
      if (confirm("Оновити ?")) {
        $http.get(config.url() + "/api/edit/update_description", {withCredentials: true})
          .success(function (response) {
          })
      }
    }

    $scope.updateImages = function() {
      if (confirm("Оновити ?")) {
        $http.get(config.url() + "/api/edit/update_images", {withCredentials: true})
          .success(function (response) {
          })
      }
    }

    $scope.updateAllImages = function() {
      if (confirm("Оновити ?")) {
        $http.get(config.url() + "/api/admin/update_all_images", {withCredentials: true})
          .success(function (response) {
          })
      }
    }

    $scope.isAdmin = function() {
       return authorization.isAdmin();
    }

    $scope.isEditor = function() {
       return authorization.isEditor();
    }

  });
