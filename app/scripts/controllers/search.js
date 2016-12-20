'use strict';

	angular.module('angularApp')
  .controller('SearchCtrl', function($scope, $http, $location, config) {
    $scope.searchString = "";

    $scope.my_search = function() {
      $scope.books = "";
      $scope.proceedSearch = true;
      if ($scope.search_string == ''){
        $scope.books = "";
        $scope.proceedSearch = false;
        return
      }
      var page = $location.search().page;
      if (page === undefined){
        page = 1;
      }else{
        page = parseInt(page);
      };
      $http.get(config.url() + "/api/books/search_by_one_criteria?search_string=" + $scope.search_string + "&page=" + (page - 1))
        .success(function(response) {
          var booksList = response.booksList;
          for (var key in booksList) {
            if (booksList[key].image == '') {
              booksList[key].image = '/img/no_picture_ru_165.jpg';
            }
            booksList[key].opened = false;
          }
        	$scope.books = booksList;
          $scope.proceedSearch = false;

          $scope.pages = [];
          $scope.goodsCount = response.countInList;
          var pagesCount = Math.ceil($scope.goodsCount / 40);
          var startPage = 1;
          if (page <= 4) {
            startPage = 1;
          }else{
            startPage = page - 4;
          }
          var endPage = 10;
          if (pagesCount > 10) {
            if (page > 5){
              if ((page + 4) > pagesCount) {
                endPage = pagesCount;
              }else{
                endPage = page + 4;
              }
            }else{
              endPage = 10;
            }
          }else{
            endPage = pagesCount;
          }
          for(var i = startPage; i <= endPage; i++){
            var active = false;
            if (page == i) {
              active = true;
            }
            $scope.pages.push({page: i, url: "#/search?search_string=" + $scope.search_string + "&page=" + i, active: active})
          }
          var pagePrevious = page > 2 ? page - 1: 1;
          var pageNext = page < pagesCount ? page + 1: pagesCount;
          $scope.pagePrevious = "#/search?search_string=" + $scope.search_string + "&page=" + pagePrevious;
          $scope.pageNext = "#/search?search_string=" + $scope.search_string + "&page=" + pageNext;

        })
    };

    var search_string = $location.search().search_string;
    if (search_string !== ''){
      $scope.search_string = search_string;
      $location.search().page = 1;
      $scope.my_search();
    };
  });
