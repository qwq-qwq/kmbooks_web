'use strict';

angular.module('angularApp')
  .controller('PromoCodesCtrl', function($scope, $http, $location, $route, config, authorization, utils, $rootScope) {

    $http.get(config.url() + "/api/edit/promo_codes/all", {withCredentials: true})
      .success(function (response) {
        for(var k in response) {
          response[k].dateStart = new Date(response[k].dateStart);
          response[k].dateEnd = new Date(response[k].dateEnd);
          response[k].editing = false;
          response[k].row_id = k;
        }
        $scope.promoCodes = response;
      })

    $scope.AddItem = function () {
      function getRandomId() {
        return Math.floor((Math.random()*10000)+1)+1000;
      }
      var promoCode = {id: '', row_id: getRandomId(), name: '', percent: 0, active: true, dateStart: new Date(), dateEnd: new Date(), minOrderAmount: 0, editing: true};
      $scope.promoCodes.unshift(promoCode);
    }

    $scope.doneEditing = function (item) {
      item.editing = false;
      var promoCode = {id: item.id, name: item.name, percent: item.percent, active: item.active, minOrderAmount: item.minOrderAmount, dateStart: item.dateStart, dateEnd: item.dateEnd};
      $http.post(config.url() + "/api/edit/promo_codes/update", promoCode, {withCredentials: true})
        .success(function(response) {
          item.id = response.id;
        });
    }

    $scope.deleteItem = function (item) {
      $http.post(config.url() + "/api/edit/promo_codes/delete", item, {withCredentials: true})
        .success(function(response) {
          for (var k in $scope.promoCodes) {
            if ($scope.promoCodes[k].row_id == item.row_id) {
              $scope.promoCodes.splice(k, 1);
              break;
            }
          }
        })
    }

    $scope.editItem = function (item) {
      item.editing = true;
    }

  });
