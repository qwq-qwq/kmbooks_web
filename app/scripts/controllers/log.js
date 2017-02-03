/**
 * Created by Desster on 27.10.2015.
 */
'use strict';

angular.module('angularApp')
  .controller('LogTableCtrl', function($scope, $http, config, utils) {

    $http.get(config.url() + "/api/admin/log/last", {withCredentials: true})
      .success(function(response) {
        $scope.logs = response;
      })

    $scope.toDateTime = function(ObjId) {
      return utils.toDateTime(ObjId);
    }
  });

