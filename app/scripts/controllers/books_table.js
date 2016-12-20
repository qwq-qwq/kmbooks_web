/**
 * Created by Desster on 17.09.2015.
 */

'use strict';

angular.module('angularApp')
  .controller('BooksTableCtrl', function($scope, $http, $location, config) {

    if ($location.path() == '/catalog') {
       var group = $location.search().group;
       var page = $location.search().page;
       var url = "";
       if (page === undefined){
         page = 1;
       }else{
         page = parseInt(page);
       };
       url = config.url() + "/api/books/search?group=" + group + "&page=" + (page - 1);
       $scope.myTitle = 'Каталог';
       $scope.myHeader = 'Каталог';
       $http.get(url)
        .success(function(response) {
          var booksList = response.booksList;
          for (var key in booksList) {
            if (booksList[key].image == '') {
              booksList[key].image = '/img/no_picture_ru_165.jpg';
            }
            if (booksList[key].sale > 0) {
              booksList[key].table_caption = 'Залишки шт. (продаж шт.)';
              booksList[key].type_rests = 'Продано: ';
              booksList[key].rests = '(' + booksList[key].sale + ' шт.)';
            }else{
              booksList[key].table_caption = 'Залишки шт.';
              booksList[key].rests = '';
            }
          }
          $scope.pages = [];
          $scope.books = booksList;
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
            $scope.pages.push({page: i, url: "#/catalog?group=" + group + "&page=" + i, active: active})
          }
          var pagePrevious = page > 2 ? page - 1: 1;
          var pageNext = page < pagesCount ? page + 1: pagesCount;
          $scope.pagePrevious = "#/catalog?group=" + group + "&page=" + pagePrevious;
          $scope.pageNext = "#/catalog?group=" + group + "&page=" + pageNext;
        })
    }

    if ($location.path() == '/bestsellers') {
      $scope.myTitle = 'Бестселери';
      $scope.myHeader = 'Бестселери';
      $http.get(config.url() + "/api/books/best_of_week_all")
        .success(function(response) {
          for (var key in response) {
            if (response[key].image == '') {
               response[key].image = '/img/no_picture_ru_165.jpg';
            }
            if (response[key].sale > 0) {
               response[key].table_caption = 'Залишки шт. (продаж шт.)';
               response[key].type_rests = 'Продано: ';
               response[key].rests = '(' + response[key].sale + ' шт.)';
            }else{
               response[key].table_caption = 'Залишки шт.';
               response[key].rests = '';
            }
          }
          $scope.books = response;
        })
    }

    if ($location.path() == '/novelties') {
      $scope.myTitle = 'Новинки';
      $scope.myHeader = 'Новинки';
      $http.get(config.url() + "/api/books/novelties_all")
        .success(function(response) {
          for (var key in response) {
            if (response[key].image == '') {
              response[key].image = '/img/no_picture_ru_165.jpg';
            }
            response[key].table_caption = 'Залишки шт.';
            response[key].type_rests = 'Залишки: ';
            response[key].rests = response[key].kvo + ' шт.';
          }
          $scope.books = response;
        })
    }

    $scope.animateElementIn = function($el) {
      $el.removeClass('not-visible');
      $el.addClass('animated pulse'); // this example leverages animate.css classes
    };

    $scope.animateElementOut = function($el) {
      $el.addClass('not-visible');
      $el.removeClass('animated pulse'); // this example leverages animate.css classes
    };

  });

