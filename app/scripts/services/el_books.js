/**
 * Created by sergey on 10.03.17.
 */

'use strict';

angular.module('angularApp').factory('elBooks', function ($http, $rootScope, config, authorization) {
  var elBooks;
  return {
    GetWishList: function () {
      return elBooks;
    },
    Exist: function () {
      if (elBooks === undefined){
        return false;
      }else{
        return true;
      }
    },
    SetWishList: function (newElBooks) {
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
    GetStoredWishList: function () {
      if (authorization.isAuthorized()){
         $http.get(config.url() + "/api/user/", {withCredentials: true})
           .success(function(response) {
             elBooks = response;
             $rootScope.$broadcast('el_books_has_added');
           })
      }
    }

  }});

