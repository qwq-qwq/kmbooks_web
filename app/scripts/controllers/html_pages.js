/**
 * Created by sergey on 13.02.17.
 */
angular.module('angularApp')
  .controller('HtmlPagesEditCtrl', function($scope, $http, $location, FileUploader,
                                            $route, $timeout, config, api) {

    api.checkOnConfigRights();
    $scope.editing = 1;
    $http.get(config.url() + "/api/html_pages")
      .success(function(response) {
        for(var k in response) {
          response[k].editing = false;
          response[k].row_id = k;
        }
        $scope.html_pages = response;
      })

    $scope.editItem = function (item) {
      item.editing = true;
    }

    $scope.doneEditing = function (item) {
      item.editing = false;
      var html_page = {id: item.id, name: item.name, title: item.title, text: item.text};
      $http.post(config.url() + "/api/edit/html_page/update", html_page, {withCredentials: true})
        .success(function(response) {
          item.id = response.id;
        });
    }

    $scope.AddItem = function () {
      function getRandomId() {
        return Math.floor((Math.random()*10000)+1)+1000;
      }
      var html_page = {id: '', row_id: getRandomId(), name: '', title: '', text: '', editing: true};
      $scope.html_pages.unshift(html_page);
    }

    $scope.deleteItem = function (item) {
      $http.post(config.url() + "/api/edit/html_page/delete", item, {withCredentials: true})
        .success(function(response) {
          for (var k in $scope.html_pages) {
            if ($scope.html_pages[k].row_id == item.row_id) {
              $scope.html_pages.splice(k, 1);
              break;
            }
          }
        })
    }


  });
