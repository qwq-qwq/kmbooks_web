/**
 * Created by sergey on 03.04.17.
 */

'use strict';

angular.module('angularApp')
  .controller('CallbacksCtrl', function($scope, $http, config, utils) {
    $http.get(config.url() + "/api/orders_admin/callbacks/last", {withCredentials: true})
      .success(function(response) {
        $scope.callbacks = response;
      })

    $scope.toDateTime = function(ObjId) {
      return utils.toDateTime(ObjId);
    }
  });
