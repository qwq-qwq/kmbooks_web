/**
 * Created by Desster on 17.09.2015.
 */

'use strict';

angular.module('angularApp')
  .controller('BooksTableCtrl', function($scope, $http, $location, config) {

    if ($location.path() == '/catalog') {
       var group = $location.search().group;
       $scope.myTitle = 'Каталог';
       $scope.myHeader = 'Каталог';
       $http.get(config.url() + "/api/books/search?group=" + group)
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

