/**
 * Created by sergey on 04.05.17.
 */
'use strict';

angular.module('angularApp')
  .controller('CommentsEditCtrl', function(order, $scope, $http, config, utils) {
    $scope.selector = {};

    $http.get(config.url() + "/api/edit/comments", {withCredentials: true})
      .success(function (response) {
        $scope.comments = response;
        for(var k in response) {
          response[k].row_id = k;
        }
      })

    $scope.editItem = function (item) {
      item.editing = true;
    }

    $scope.doneEditing = function (item) {
      item.editing = false;
      var comment = {id: item.id, name: item.name, email: item.email, code: item.code, approved: item.approved, text: item.text};
      $http.post(config.url() + "/api/edit/comment/update", comment, {withCredentials: true})
        .success(function(response) {
          item.id = response.id;
        });
    }

    $scope.AddItem = function () {
      function getRandomId() {
        return Math.floor((Math.random()*10000)+1)+1000;
      }
      var comment = {id: '', row_id: getRandomId(), name: '', email: '', code: 0, approved: false, text: '', editing: true};
      $scope.comments.unshift(comment);
    }

    $scope.deleteItem = function (item) {
      $http.post(config.url() + "/api/edit/comment/delete", item, {withCredentials: true})
        .success(function(response) {
          for (var k in $scope.comments) {
            if ($scope.comments[k].row_id == item.row_id) {
              $scope.comments.splice(k, 1);
              break;
            }
          }
        })
    }

    $scope.toDateTime = function(ObjId) {
      return utils.toDateTime(ObjId);
    }

  })
