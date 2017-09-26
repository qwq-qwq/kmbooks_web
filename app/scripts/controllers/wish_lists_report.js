/**
 * Created by sergey on 15.02.17.
 */

'use strict';

angular.module('angularApp')
  .controller('WishListsReportCtrl', function($scope, $http, $location, $route, config, authorization, utils, $rootScope) {
    $scope.username = authorization.username();
    $scope.selectors = {};
    $scope.dateEnd = new Date(new Date().getTime() + 1 * 1000 * 60 * 60 * 24); //taking tomorrow date for covering current day
    $scope.dateStart = new Date($scope.dateEnd - 10 * 1000 * 60 * 60 * 24);

    $rootScope.$on('successful_authorization', function () {
      $scope.username = authorization.username();
    })

    $scope.toDateTime = function(ObjId) {
      return utils.toDateTime(ObjId);
    }

    $scope.GetWishListGroupedByBooks = function () {
      var link = '';
      var dateStart, dateEnd;
      $scope.saving = true;
      $scope.styleOrdersList = {opacity: 0.2};
      dateStart = $scope.dateStart.getDate().toString() + "." + ("0" +($scope.dateStart.getMonth() + 1).toString()).slice(-2) + "." + $scope.dateStart.getFullYear().toString();
      dateEnd = $scope.dateEnd.getDate().toString() + "." + ("0" +($scope.dateEnd.getMonth() + 1).toString()).slice(-2) + "." + $scope.dateEnd.getFullYear().toString();
      if ($scope.dateStart && $scope.dateEnd) {
        link = "dateStart=" + dateStart + "&dateEnd=" + dateEnd;
      }
      $http.get(config.url() + "/api/edit/wish_lists/grouped_by_books?" + link, {withCredentials: true})
        .success(function (response) {
          $scope.booksInWishLists = response;
          $scope.styleOrdersList = {opacity: 1};
          $scope.saving = false;
        })
    }

  });
