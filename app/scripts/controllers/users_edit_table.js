
angular.module('angularApp')
  .controller('UsersEditTableCtrl', function($scope, $http, $location, FileUploader, $route, $timeout, config) {
    $scope.roles = ['USER', 'EDITOR', 'ADMIN'];
    $http.get(config.url() + "/api/admin/all_users", {withCredentials: true})
      .success(function(response) {
        for(var k in response) {
          response[k].editing = false;
        }
        $scope.users = response;
      })

    $scope.editItem = function (item) {
      item.editing = true;
    }

    $scope.doneEditing = function (item) {
      var user = {email: item.email, role: item.role, password: item.password};
      item.editing = false;
      $http.post(config.url() + "/api/admin/user_update", user, {withCredentials: true})
        .success(function(response) {
          //item.id = response.id;
          //$scope.UpdateId(item.row_id, item.id);
        });
    }

    $scope.AddItem = function () {
      var user = {email: '', role: 'USER', password: '', editing: true};
      $scope.users.unshift(user);
    }

    $scope.deleteItem = function (item) {
      $http.post(config.url() + "/api/admin/user_delete", item, {withCredentials: true})
        .success(function(response) {
          for (var k in $scope.users) {
            if ($scope.users[k].email == item.email) {
               $scope.users.splice(k, 1);
               break;
            }
          }
        })
    }

  });
