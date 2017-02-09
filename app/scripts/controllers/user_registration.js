/**
 * Created by sergey on 08.02.17.
 */

angular.module('angularApp')
  .controller('UserRegistrationCtrl', function(authorization, $scope, $http, api, config) {
    if (authorization.isAuthorized()){
       $scope.user = authorization.getUser();
       $scope.isNewUser = false;
    }else{
       $scope.user = {email: '', role: 'USER', password: '', name: '', phone: '', address: '',};
      $scope.isNewUser = true;
    }

    $scope.doneEditing = function () {
      $http.post(config.url() + "/api/register_user", $scope.user)
        .then(function successCallback(response) {
          $scope.savedSuccess = true;
          api.init();
        }, function errorCallback(response) {
          $scope.savedError = true;
          api.init();
        })
    }

  });
