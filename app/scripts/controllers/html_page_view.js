/**
 * Created by sergey on 13.02.17.
 */
'use strict';

angular.module('angularApp')
  .controller('HtmlPageCtrl', function($scope, $http, config, $location) {
    var name = $location.search().name;

    $http.get(config.url() + '/api/html_page?name=' + name)
      .success(function (response) {
        $scope.htmlPage = response;
      })

  });
