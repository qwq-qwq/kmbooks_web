/**
 * Created by Desster on 17.09.2015.
 */

'use strict';

angular.module('angularApp')
  .controller('BooksTableCtrl', function($scope, $http, $location, config) {

    $scope.catalog = function () {

      function update_filter() {
        var filter = '';
        if (group !== undefined) {
          filter += "&group=" + group;
        }
        if ($scope.priceSliderValue !== undefined) {
          filter += "&priceFrom=" + $scope.priceSliderValue[0];
          filter += "&priceTo=" + $scope.priceSliderValue[1];
        }else{
          $scope.priceSliderValue = [0, 0];
        }
        return filter
      }

      var group = $location.search().group;
      var page = $location.search().page;
      var priceFrom = $location.search().priceFrom;
      var priceTo = $location.search().priceTo;
      if (page === undefined){
        page = 1;
      }else{
        page = parseInt(page);
      };
      if (group !== undefined) {
        $http.get(config.url() + "/api/get_catalog_element?group=" + group)
          .success(function(response) {
            $scope.myTitle = response.name;
            $scope.myHeader = response.name;
          });
      }
      if (priceFrom !== undefined && priceTo !== undefined){
        $scope.priceSliderValue = [parseInt(priceFrom), parseInt(priceTo)];
      }
      var filter = update_filter();
      $http.get(config.url() + "/api/books/search?page=" + (page - 1) + filter)
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
          $scope.books = booksList;
          $scope.goodsCount = response.countInList;
          $scope.priceFrom = 1;
          $scope.priceTo = 1200;
          $scope.priceSliderValue = [response.priceFrom, response.priceTo];
          filter = update_filter();
          $scope.pages = [];
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
            $scope.pages.push({page: i, url: "#/catalog?page=" + i + filter, active: active})
          }
          var pagePrevious = page > 2 ? page - 1: 1;
          var pageNext = page < pagesCount ? page + 1: pagesCount;
          $scope.pagePrevious = "#/catalog?page=" + pagePrevious + filter;
          $scope.pageNext = "#/catalog?page=" + pageNext + filter;
        })
    }

    if ($location.path() == '/catalog') {
       $scope.catalog();
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

    $scope.isCatalog = function() {
      if ($location.path().search('catalog') != -1) {
        return true
      }else{
        return false}
    }

    $scope.priceFilterApply = function () {
       $location.search().page = 1;
       if ($scope.priceSliderValue !== undefined) {
         $location.search().priceFrom = $scope.priceSliderValue[0];
         $location.search().priceTo = $scope.priceSliderValue[1];
       }
       $scope.catalog();
    }

  });

