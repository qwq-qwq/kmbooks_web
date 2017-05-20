/**
 * Created by sergey on 04.05.17.
 */
'use strict';

angular.module('angularApp')
  .controller('CommentsEditCtrl', function(order, $scope) {
    $scope.selector = {};

    $http.get(config.url() + "/api/gmaps")
      .success(function (response) {
        $scope.gmap = response;
        $scope.gmap.unshift({name: "Без метки", sprut_code: 0});
      })

    $scope.editItem = function (item) {
      item.editing = true;
    }

    $scope.doneEditing = function (item) {
      item.editing = false;
      var event = {id: item.id, title: item.title, where: item.where, when: item.when, end: item.end, text: item.text, codeShop: item.codeShop};
      $http.post(config.url() + "/api/edit/event_update", event, {withCredentials: true})
        .success(function(response) {
          item.id = response.id;
          if (typeof item.upl_item != 'undefined'){
            item.upl_item.formData[0].id = response.id;
            item.upl_item.upload();
          }
        });
    }

    $scope.AddItem = function () {
      function getRandomId() {
        return Math.floor((Math.random()*10000)+1)+1000;
      }
      var event = {id: '', row_id: getRandomId(), title: '', where: '', when: new Date(), end: new Date(), text: '', editing: true};
      $scope.events.unshift(event);
    }

    $scope.deleteItem = function (item) {
      $http.post(config.url() + "/api/edit/event_delete", item, {withCredentials: true})
        .success(function(response) {
          for (var k in $scope.events) {
            if ($scope.events[k].row_id == item.row_id) {
              $scope.events.splice(k, 1);
              break;
            }
          }
        })
    }

  })
