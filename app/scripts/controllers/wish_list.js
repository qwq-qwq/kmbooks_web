/**
 * Created by sergey on 04.02.17.
 */

'use strict';

angular.module('angularApp')
  .controller('WishListCtrl', function($scope, $http, $location, $anchorScroll, $route, config,
                                       wishList, utils, authorization, $rootScope) {
    $scope.updateWishList = function () {
      $scope.username = authorization.username();

      $http.get(config.url() + "/api/user/wish_lists/get_by_username?username=" + authorization.username(), {withCredentials: true})
        .success(function(response) {
          $scope.wishList = response;
          var codeString = '';
          angular.forEach(response, function (value, key) {
             codeString += ',' + value.code;
          })
          $http.get(config.url() + "/api/books/search?code=" + codeString.substr(1))
            .success(function(response) {
              var books = response.bookList;
              angular.forEach($scope.wishList, function (wishItem, key) {
                angular.forEach(books, function (book, key) {
                  if(wishItem.code === book.code){
                    wishItem.book = book;
                  }
                })
              })

            })
        })
    }

    $scope.updateWishList();
    $rootScope.$on('wish_list_has_added', function () {
       $scope.updateWishList();
    })

    $scope.removeFromList = function (item) {
      $http.post(config.url() + "/api/user/wish_lists/delete", item, {withCredentials: true})
        .success(function(response) {
          if ($scope.wishList !== undefined){
            angular.forEach($scope.wishList, function(value, key) {
              if (value.id === item.id) {
                $scope.wishList.splice(key, 1);
                wishList.SetWishList($scope.wishList);
              }
            });
          }
        })
    }

    $scope.toDateTime = function(ObjId) {
      return utils.toDateTime(ObjId);
    }

  });
