/**
 * Created by sergey on 08.02.17.
 */

angular.module('angularApp')
  .controller('UserRegistrationCtrl', function(authorization, $scope, $http, $location, FileUploader, $route, $timeout, config) {
    if (authorization.isAuthorized()){
       $scope.user = authorization.getUser();
    }else{
       $scope.user = {email: '', role: 'USER', password: '', name: '', phone: '', address: '',};
    }

    $scope.doneEditing = function (item) {
      $http.post(config.url() + "/api/register_user", $scope.user, {withCredentials: true})
        .success(function(response) {
          api.init();
        });
    }

  });
