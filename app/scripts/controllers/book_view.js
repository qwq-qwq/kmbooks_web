/**
 * Created by Desster on 17.12.2015.
 */
'use strict';

angular.module('angularApp')
  .controller('BookViewCtrl', function ($scope, $http, $window, $location, authorization,
                                        FileUploader, config, pageTitle) {
    var code = $location.search().code;
    $scope.gallery = {images: [], opts: "", show: false};
    $scope.cropSelection = {src:"", selection: [], thumbnail: false};
    $scope.absUrl = $location.absUrl();

    $window.scrollTo(0, 0);

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
    }

    uploader.onAfterAddingFile = function(fileItem) {
       $scope.book.upl_item = fileItem;
    };

    uploader.onSuccessItem = function(fileItem, response, status, headers) {
       $scope.bannerImage = response.image;
       $scope.book.upl_item = null;
    };

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
      alert("Ошибка добавления файла, разрешены только изображения");
    };

    uploader.onErrorItem = function(fileItem, response, status, headers) {
      $scope.book.upl_item = null;
      alert("При загрузке файла на сервер возникла ошибка");
    };

    $http.get(config.url() + '/api/books/search?code=' + code)
      .success(function (response) {
        $scope.book = response.bookList[0];
        pageTitle.SetTitle($scope.book.name + ' купити книгу в Києві і Україні.');
        pageTitle.SetDescription('Інтернет-магазин kmbooks.com.ua: ' + $scope.book.name + '. Автор: ' + $scope.book.author
                         + '. Доставка: Киев, Украина. ' + $scope.book.description);
        var metaTags = {absUrl: $scope.absUrl, title: $scope.book.name, description: $scope.book.description,
                        image: 'http://kmbooks.com.ua' + $scope.book.image, ISBN: $scope.book.isbn, author: $scope.book.author};
        pageTitle.SetBookMetaTags(metaTags);
      })

    $http.get(config.url() + '/api/books/images?code=' + code)
      .success(function (response) {
        angular.forEach(response, function (image, key) {
            if (image.flat === true) {
              $scope.flatImageIndex = key;
              $scope.flatImage = image.src.replace('.jpg', '_big.jpg');
            }
            $scope.gallery.images[key] = {
              srcThumbNail: image.src.replace('.jpg', '_big.jpg'),
              flat: image.flat,
              src: image.src.replace('.jpg', '_original.jpg'),
              w: image.width,
              h: image.height
            };
        })
        if ($scope.flatImage === undefined){
          angular.forEach(response, function (image, key) {
            if (image.main === true) {
              $scope.flatImageIndex = key;
              $scope.flatImage = image.src.replace('.jpg', '_big.jpg');
            }
          })
        }
        var bannerHeight = angular.element('#bookBanner').height();
        var offset = 10;
        //if (bannerHeight > 250) {
        //  offset = 10;
        //}
        var flatImageHeight = bannerHeight - 60 - offset + bannerHeight/8;
        $scope.flatImageHeight={height: flatImageHeight};
      })

    $http.get(config.url() + '/api/books/banner_book?code=' + code)
      .success(function (response) {
        if (response.image === null) {
          $scope.bannerImage = '/img/pics/' + code + '_banner.jpg';
        }else{
          $scope.bannerImage = response.image;
        };
      })

    $http.get(config.url() + '/api/books/description?code=' + code)
      .success(function (response) {
        $scope.description = response.text.replace(/([^>])\n/g, '$1<br/>'); //nl2br
      })

    $http.get(config.url() + '/api/news/get_news_by_code_book?code=' + code)
      .success(function (response) {
        $scope.news = response;
      })

    $http.get(config.url() + '/api/files_for_book/get_by_code?code=' + code)
      .success(function (response) {
        $scope.bookFragment = response;
      })

    $scope.gallery.opts = {
      index: 0,
      history: false,
      bgOpacity: 0.5
    };

    $scope.showGallery = function (i) {
      $scope.gallery.opts.index = i;
      $scope.gallery.show = true;
    };

    $scope.closeGallery = function () {
      $scope.gallery.show = false;
    };

    $scope.isEditor = function() {
      return authorization.isEditor();
    }

    $scope.uploaderFile = new FileUploader({
      url: config.url() + '/api/edit/files_for_book/upload',
      removeAfterUpload: true,
      withCredentials: true
    });
    var uploaderFile = $scope.uploaderFile;
    uploaderFile.filters.push({
      name: 'fileFilter',
      fn: function(item /*{File|FileLikeObject}*/, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|pdf|'.indexOf(type) !== -1;
      }
    });

    $scope.saveFileItem = function (item) {
      item.editing = false;
      item.upl_itemFile.upload();
    }

    uploaderFile.onAfterAddingFile = function(fileItem) {
      $scope.book.upl_itemFile = fileItem;
    };

    uploaderFile.onSuccessItem = function(fileItem, response, status, headers) {
      $scope.bookFragment = response;
      $scope.book.upl_itemFile = null;
    };

    uploaderFile.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
      alert("Ошибка добавления файла, разрешены только pdf");
    };

    uploaderFile.onErrorItem = function(fileItem, response, status, headers) {
      $scope.book.upl_itemFile = null;
      alert("При загрузке файла на сервер возникла ошибка");
    };

    $scope.OpenFragment = function (url) {
      $window.open('http://kmbooks.com.ua' + url);
    }


  });
