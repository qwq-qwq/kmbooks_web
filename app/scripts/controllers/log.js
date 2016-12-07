/**
 * Created by Desster on 27.10.2015.
 */
'use strict';

angular.module('angularApp')
  .controller('LogTableCtrl', function($scope, $http, config) {

    $http.get(config.url() + "/api/admin/log/last", {withCredentials: true})
      .success(function(response) {
        $scope.logs = response;
      })

    $scope.toDateTime = function(ObjId) {
      var ObjDate;
      ObjDate = new Date(parseInt(ObjId.toString().slice(0,8), 16)*1000);
      return ObjDate.toLocaleDateString() + ' ' + ObjDate.toLocaleTimeString();
    }
  });

