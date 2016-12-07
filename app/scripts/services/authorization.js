
'use strict';

angular.module('angularApp').factory('authorization', function ($rootScope, $http, config) {

  return {
    login: function (credentials) {

      var headers = credentials ? {
        authorization: "Basic "
        + btoa(credentials.username + ":" + credentials.password)
      } : {};
      return $http.get(config.url() + '/api/admin/user', {headers: headers, withCredentials: true})
    },
    logout: function(){
      return $http.post(config.url() + '/logout', {}, {withCredentials: true})
    },
    isAdmin: function() {
    if ($rootScope.role == 'ADMIN') {
      return true
    }else{
      return false}
    },
    isEditor: function() {
    if ($rootScope.role === 'EDITOR'|| $rootScope.role === 'ADMIN') {
      return true
    }else{
      return false}
    },
    isUser: function() {
    if ($rootScope.role === 'EDITOR'|| $rootScope.role === 'ADMIN' || $rootScope.role === 'USER') {
      return true
    }else{
      return false}
    },
    onlyIsUser: function() {
    if ($rootScope.role === 'USER') {
        return true
    }else{
        return false}
    }

  }});
