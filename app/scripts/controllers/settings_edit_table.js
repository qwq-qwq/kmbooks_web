/**
 * Created by Desster on 17.12.2015.
 */
'use strict';

angular.module('angularApp')
  .controller('SettingsEditTableCtrl', function($scope, $http, config) {

    $http.get(config.url() + "/api/settings")
      .success(function (response) {
        $scope.settings = response;
      })

    $scope.editItem = function (item) {
      item.editing = true;
    }
    $scope.doneEditing = function (item) {
      item.editing = false;
      var event = {id: item.id, recommended: item.recommended};
      $http.post(config.url() + "/api/edit/settings_update", event, {withCredentials: true})
        .success(function(response) {
            if (event.id == 0) {
                $route.reload();
            }
        });
    }

});
