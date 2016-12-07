'use strict';

angular.module('angularApp')
  .controller('EventViewCtrl', function ($scope, $http, $location, Lightbox, config) {
    var id = $location.search().id;

    function compare_desc(a,b) {
      if (a.when > b.when)
        return -1;
      else if (a.when < b.when)
        return 1;
      else
        return 0;
    }

    $http.get(config.url() + '/api/event?id=' + id)
      .success(function (response) {
        $scope.event = response;
        $scope.bigImage = response.image.replace('/img/', '/img/big_')
      })

    $http.get(config.url() + "/api/events")
      .success(function(response) {
        $scope.events = response.sort(compare_desc).splice(0, 12);
      })
  });
