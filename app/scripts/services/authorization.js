
'use strict';

angular.module('angularApp').factory('authorization', function ($rootScope, $http, config) {
  function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
      return String.fromCharCode('0x' + p1);
    }));
  }
  return {
    login: function (credentials) {
      var headers = credentials ? {
        authorization: "Basic "
        + b64EncodeUnicode(credentials.username + ":" + credentials.password)
      } : {};
      return $http.get(config.url() + '/api/admin/user', {headers: headers, withCredentials: true})
    },
    logout: function(){
      return $http.post(config.url() + '/logout', {}, {withCredentials: true})
    },
    username: function () {
      return $rootScope.username;
    },
    getUser: function () {
      return $rootScope.user;
    },
    isAuthorized: function () {
      if ($rootScope.authenticated == true) {
        return true
      }else{
        return false}
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
    isOrdersAdmin: function() {
      if ($rootScope.role === 'EDITOR'|| $rootScope.role === 'ADMIN' || $rootScope.role === 'ORDERS_ADMIN') {
        return true
      }else{
        return false}
    },
    isCopyWriter: function() {
      if ($rootScope.role === 'EDITOR'|| $rootScope.role === 'ADMIN' || $rootScope.role === 'COPYWRITER') {
        return true
      }else{
        return false}
    },
    isUser: function() {
    if ($rootScope.role === 'EDITOR'|| $rootScope.role === 'ADMIN' ||
        $rootScope.role === 'USER' || $rootScope.role === 'ORDERS_ADMIN') {
      return true
    }else{
      return false}
    },
    canAccessToAdminPart: function() {
      if ($rootScope.authenticated == true && $rootScope.role !== 'USER') {
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
