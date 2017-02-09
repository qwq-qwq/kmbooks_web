/**
 * Created by sergey on 09.02.17.
 */
'use strict';

angular.module('angularApp').directive('bkCheckEmail', ['$http', 'config', '$q', function($http, config, $q) {
  return {
    restrict: 'A',
    require: "ngModel",
    scope: {
      email: '='
    },
    link: function(scope, element, attributes, ngModel) {
      ngModel.$asyncValidators.checkEmailUnique = function(modelValue) {
        return $http.get(config.url() + "/api/check_user_exist?email=" + modelValue)
          .then(function successCallback(response) {
            if (response.data){
              return $q.reject('exist');
            }else{
              return $q.resolve('ok');
            }
          }, function errorCallback(response) {
             return true;
          })
      };
     /* scope.$watch("email", function() {
        ngModel.$validate();
      });*/
    }
  };
}])
