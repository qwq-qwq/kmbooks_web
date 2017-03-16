/**
 * Created by Desster on 17.12.2015.
 */
'use strict';

angular.module('angularApp')
  .controller('BookViewCtrl', function ($scope, $http, $window, $location, authorization,
                                        FileUploader, config, pageTitle, utils) {
    var code = $location.search().code;
    $scope.gallery = {images: [], opts: "", show: false};
    $scope.cropSelection = {src:"", selection: [], thumbnail: false};
    $scope.absUrl = $location.absUrl();

    $scope.bookFormats = ['.pdf', '.epub', '.fb2', '.mobi'];
    $scope.bookTypes = ['fragment', 'book'];
    $scope.selectors = {};

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

    var wayForPay = new Wayforpay();

    $scope.editItem = function (item) {
      if (!$scope.isEditor()){
        return;
      }
      item.editing = true;
      $http.get(config.url() + '/api/edit/files_for_book/get_file_names_by_code?code=' + $scope.book.code, {withCredentials: true})
        .success(function (response) {
          $scope.existedFiles = response;
        })
    }

    $scope.saveItem = function (item) {
      $scope.bannerSaving = true;
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
      $scope.bannerSaving = false;
       $scope.bannerImage = response.image;
       $scope.book.upl_item = null;
    };

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
      $scope.bannerSaving = false;
      alert("Ошибка добавления файла, разрешены только изображения");
    };

    uploader.onErrorItem = function(fileItem, response, status, headers) {
      $scope.bannerSaving = false;
      $scope.book.upl_item = null;
      alert("При загрузке файла на сервер возникла ошибка");
    };

    $http.get(config.url() + '/api/books/search?code=' + code)
      .success(function (response) {
        $scope.book = response.bookList[0];
        pageTitle.SetTitle($scope.book.name + ' купити книгу в Києві і Україні.');
        pageTitle.SetDescription('Інтернет-магазин kmbooks.com.ua: ' + $scope.book.name + '. Автор: ' + $scope.book.author
                         + '. Доставка: Киев, Украина. ' + $scope.book.description);
      })

    $http.get(config.url() + '/api/books/images?code=' + code)
      .success(function (response) {
        angular.forEach(response, function (image, key) {
            if (image.flat === true) {
              $scope.flatImageIndex = key;
              $scope.flatImage = image.src.replace('.jpg', '_big.jpg');
              $scope.flatImageRatio = image.height !== 0 ? image.width/image.height : 0;
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
              $scope.flatImageRatio = image.height !== 0 ? image.width/image.height : 0;
            }
          })
        }
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

    $scope.saveFileItem = function (item) {
      $scope.fileSaving = true;
      item.upl_itemFile.formData[0].type = $scope.selectors.bookType;
      item.upl_itemFile.formData[0].format = $scope.selectors.bookFormat;
      item.upl_itemFile.upload();
    }

    uploaderFile.onAfterAddingFile = function(fileItem) {
      $scope.book.upl_itemFile = fileItem;
    };

    uploaderFile.onSuccessItem = function(fileItem, response, status, headers) {
      $http.get(config.url() + '/api/edit/files_for_book/get_file_names_by_code?code=' + $scope.book.code, {withCredentials: true})
        .success(function (response) {
          $scope.existedFiles = response;
        })
      $scope.fileSaving = false;
      $scope.bookFragment = response;
      $scope.book.upl_itemFile = null;
    };

    uploaderFile.onErrorItem = function(fileItem, response, status, headers) {
      $scope.fileSaving = false;
      $scope.book.upl_itemFile = null;
      alert("При загрузке файла на сервер возникла ошибка");
    };

    $scope.OpenFragment = function (url) {
      $window.open('http://kmbooks.com.ua' + url);
    }


  });
