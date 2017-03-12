/**
 * Created by sergey on 08.02.17.
 */

angular.module('angularApp')
  .controller('UserRegistrationCtrl', function(authorization, $scope, $http, api, config, $rootScope, $location) {

    $scope.updateVisible = function () {
      if (!authorization.isAuthorized()){
        $scope.updateInfo = true;
        $scope.updatePassword = true;
      }else{
        if($location.path() == '/user_registration'){
          $scope.updateInfo = true;
          $scope.updatePassword = false;
        }else if($location.path() == '/user_update_password'){
          $scope.updateInfo = false;
          $scope.updatePassword = true;
        }
      }
    }

    $scope.updateVisible();

    if (authorization.isAuthorized()){
       $scope.user = authorization.getUser();
       $scope.isNewUser = false;
    }else{
       $scope.user = {email: '', role: 'USER', password: '', name: '', phone: '', address: '',};
       $scope.isNewUser = true;
    }

    $rootScope.$on('successful_authorization', function () {
       $scope.user = authorization.getUser();
       $scope.isNewUser = false;
       $scope.updateVisible();
    })

    $scope.doneEditing = function () {
      if (!authorization.isAuthorized()){
        $http.post(config.url() + "/api/register_user", $scope.user)
          .then(function successCallback(response) {
            $scope.user = response;
            $scope.savedSuccess = true;
            $scope.isNewUser = false;
          }, function errorCallback(response) {
            $scope.savedError = true;
          })
      }else{
        if ($location.path() == '/user_registration'){
          $http.post(config.url() + "/api/user/user/update_info", $scope.user, {withCredentials: true})
            .then(function successCallback(response) {
              $scope.user = response;
              $scope.savedSuccess = true;
            }, function errorCallback(response) {
              $scope.savedError = true;
            })
        }else if($location.path() == '/user_update_password'){
          $http.post(config.url() + "/api/user/user/update_password", $scope.user, {withCredentials: true})
            .then(function successCallback(response) {
              $scope.user = response;
              $scope.savedSuccess = true;
            }, function errorCallback(response) {
              $scope.savedError = true;
            })
        }
      }
    }

  });
