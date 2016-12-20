/**
 * Created by Desster on 17.12.2015.
 */
'use strict';

angular.module('angularApp')
  .controller('BookViewCtrl', function ($scope, $http, $location, Lightbox, config) {
    var code = $location.search().code;
    $http.get(config.url() + '/api/books/search?code=' + code)
      .success(function (response) {
        var images = new Array();
        var book = response.booksList[0];
        book.images = images;
        if (book.image === '') {
          book.image = '/img/no_picture_ru_165.jpg';
        } else {
          book.image = '/img/pics/' + book.code + '_big.jpg';
          /*response[0].images[0] = {
            'url': '/img/pics/' + code + '_big.jpg',
            'thumbUrl': '/img/pics/' + code + '.jpg',
            'thmb_index': 0
          };*/
        };
        $scope.book = book;
        for (var i = 1; i <= $scope.book.imagesCount - 1; i++) {
          $scope.book.images[i] = {
            'url': '/img/pics/' + code + '_' + i + '.jpg',
            'thumbUrl': '/img/pics/' + code + '_' + i + '.jpg',
            'thmb_index': i
          };
        };
        $scope.book.opened = true;
        if ($scope.book.bannerImage === null) {
           $scope.book.bannerImage = '/img/pics/' + code + '_banner.jpg';
        };
      })
    $http.get(config.url() + '/api/books/description?code=' + code)
      .success(function (response) {
        $scope.description = response.text.replace(/([^>])\n/g, '$1<br/>'); //nl2br
      })

    $scope.openLightboxModal = function (index) {
      Lightbox.openModal($scope.book.images, index);
    };

    $scope.$on('$viewContentLoaded', function (scope) {
      $http.get(config.url() + '/api/books/remains?code=' + code)
        .success(function (response) {
           $scope.remains = response;
        })
    })

  });
