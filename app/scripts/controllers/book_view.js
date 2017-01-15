/**
 * Created by Desster on 17.12.2015.
 */
'use strict';

angular.module('angularApp')
  .controller('BookViewCtrl', function ($scope, $http, $location, authorization, Lightbox, FileUploader, config) {
    $scope.cropSelection = {src:"", selection: [], thumbnail: false};

    $scope.uploader = new FileUploader({
      url: config.url() + '/api/edit/books/banner_upload',
      removeAfterUpload: true,
      withCredentials: true
    });
    var uploader = $scope.uploader;
    uploader.filters.push({
      name: 'imageFilter',
      fn: function(item /*{File|FileLikeObject}*/, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    $scope.editItem = function (item) {
      item.editing = true;
    }

    $scope.saveItem = function (item) {
      item.editing = false;
      item.upl_item.formData[0].rectangle = [$scope.cropSelection.selection[0],
                                             $scope.cropSelection.selection[1],
                                             $scope.cropSelection.selection[4],
                                             $scope.cropSelection.selection[5]];
      item.upl_item.upload();
      $scope.book.bannerImage = '';
    }

    uploader.onAfterAddingFile = function(fileItem) {
       $scope.book.upl_item = fileItem;
    };

    uploader.onSuccessItem = function(fileItem, response, status, headers) {
       $scope.book.bannerImage = '/img/pics/' + code + '_banner.jpg';
       $scope.book.upl_item = null;
    };

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
      alert("Ошибка добавления файла, разрешены только изображения");
    };

    uploader.onErrorItem = function(fileItem, response, status, headers) {
      $scope.book.upl_item = null;
      alert("При загрузке файла на сервер возникла ошибка");
    };



    var code = $location.search().code;
    $http.get(config.url() + '/api/books/search?code=' + code)
      .success(function (response) {
        $scope.book = response.booksList[0];
        var imagesCount = $scope.book.imagesCount;
        if ($scope.book.image === '') {
          $scope.book.image = '/img/no_picture_ru_165.jpg';
        } else {
          $scope.book.image = '/img/pics/' + $scope.book.code + '_big.jpg';
          imagesCount = imagesCount - 1;
        };
        $scope.book.images = [];
        if ($scope.book.image_3d !== '') {
          imagesCount = imagesCount - 1;
          $scope.book.images[0] = {
           'url': '/img/pics/' + code + '_0.jpg',
           'thumbUrl': '/img/pics/' + code + '_0.jpg',
           'thmb_index': 0
           };
        };
        for (var i = 1; i <= imagesCount; i++) {
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

    $scope.isEditor = function() {
      return authorization.isEditor();
    }

  });
