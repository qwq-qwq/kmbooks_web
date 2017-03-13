/**
 * Created by sergey on 10.03.17.
 */

'use strict';

angular.module('angularApp').factory('elBooks', function ($http, $rootScope, config, authorization) {
  var elBooks;
  return {
    GetElBooks: function () {
      return elBooks;
    },
    GetElBookLink: function (code) {
      if (elBooks !== undefined) {
        var result = '';
        angular.forEach(elBooks, function (value, key) {
          if (value.code === code) {
            result = value.link;
          }
        });
        return result;
      }else{
        return '';
      }
    },
    IsInElBooks: function (code) {
      if (elBooks !== undefined) {
        var result = false;
        angular.forEach(elBooks, function (value, key) {
          if (value.code === code) {
            result = true;
          }
        });
        return result;
      }else{
        return false;
      }
    },
    Exist: function () {
      if (elBooks === undefined){
        return false;
      }else{
        return true;
      }
    },
    SetElBooks: function (newElBooks) {
      elBooks = newElBooks;
      $rootScope.$broadcast('el_books_has_added');
    },
    IsNotEmpty: function () {
      if (elBooks !== undefined){
        if (elBooks.length > 0){
          return true;
        }else{
          return false;
        }
      }else{
        return false;
      }
    },
    ItemsCount: function () {
      if (elBooks !== undefined) {
        return elBooks.length;
      }
    },
    GetStoredElBooks: function () {
      if (authorization.isAuthorized()){
         $http.get(config.url() + "/api/admin/user", {withCredentials: true})
           .success(function(response) {
             elBooks = response.elBooks;
             $rootScope.$broadcast('el_books_has_added');
           })
      }
    }

  }});

