'use strict';

angular.module('angularApp')
  .controller('RequestsStatCtrl', function($scope, $http, $anchorScroll, $location, config) {
    $scope.dateEnd = new Date();
    $scope.dateStart = new Date($scope.dateEnd - 7 * 1000 * 60 * 60 * 24);
    $scope.search = function() {
      var link = '';
      var dateStart, dateEnd;
      dateStart = $scope.dateStart.getDate().toString() + "." + ("0" +($scope.dateStart.getMonth() + 1).toString()).slice(-2) + "." + $scope.dateStart.getFullYear().toString();
      dateEnd = $scope.dateEnd.getDate().toString() + "." + ("0" +($scope.dateEnd.getMonth() + 1).toString()).slice(-2) + "." + $scope.dateEnd.getFullYear().toString();
      if ($scope.dateStart && $scope.dateEnd) {
        link = "dateStart=" + dateStart + "&dateEnd=" + dateEnd;
      }
      $http.get(config.url() + "/api/requests/stat_authors?" + link)
        .success(function (response) {
          $scope.requests_author = response;
          for(var k in response) {
            if (response[k].id.length > 130){
              response[k].id = response[k].id.substring(0, 130) + '...';
            }
          };
        })
      $http.get(config.url() + "/api/requests/stat_names?" + link)
        .success(function (response) {
          $scope.requests_name = response;
          for(var k in response) {
            if (response[k].id.length > 130){
              response[k].id = response[k].id.substring(0, 130) + '...';
            }
          };
        })
    };
    $scope.gotoAnchor = function(x) {
      var old = $location.hash();
        $location.hash('anchor' + x);
        $anchorScroll();
        $location.hash(old);
      }

    $scope.open1 = function() {
      $scope.popup1.opened = true;
    };

    $scope.popup1 = {
      opened: false
    };

    $scope.open2 = function() {
      $scope.popup2.opened = true;
    };

    $scope.popup2 = {
      opened: false
    };
  });
;

