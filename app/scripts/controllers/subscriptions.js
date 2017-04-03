/**
 * Created by sergey on 03.04.17.
 */

'use strict';

angular.module('angularApp')
  .controller('SubscriptionsCtrl', function($scope, $http, config, utils) {

    $http.get(config.url() + "/api/edit/subscriptions/last", {withCredentials: true})
      .success(function(response) {
        $scope.subscriptions = response;
      })

    $scope.toDateTime = function(ObjId) {
      return utils.toDateTime(ObjId);
    }
  });
