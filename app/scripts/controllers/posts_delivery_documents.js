'use strict';

angular.module('angularApp')
  .controller('PostDeliveryDocsCtrl', function($scope, $http, $location, $route, config, authorization, utils, FileUploader) {

    $http.get(config.url() + "/api/new_post_documents", {withCredentials: true})
      .success(function (response) {
        for(var k in response) {
          response[k].editing = false;
          response[k].row_id = k;
        }
        $scope. newPostDocuments = response;
      })

    $http.get(config.url() + "/api/ukr_post_documents", {withCredentials: true})
      .success(function (response) {
        for(var k in response) {
          response[k].editing = false;
          response[k].row_id = k;
        }
        $scope. ukrPostDocuments = response;
      })

    $scope.fromUnixTime = function(UnixTime) {
      return utils.fromUnixTime(UnixTime);
    }

    $scope.uploaderFile = new FileUploader({
      url: config.url() + '/api/ukr_post_documents/upload',
      removeAfterUpload: true,
      withCredentials: true
    });
    var uploaderFile = $scope.uploaderFile;

    $scope.saveFileItem = function (item) {
      $scope.fileSaving = true;
      item.upl_itemFile.formData[0].type = $scope.selectors.type;
      item.upl_itemFile.upload();
    }

    uploaderFile.onAfterAddingFile = function(fileItem) {
      $scope.book.upl_itemFile = fileItem;
    };

    uploaderFile.onSuccessItem = function(fileItem, response, status, headers) {
      // $http.get(config.url() + '/api/edit/files_for_book/get_file_names_by_code?code=' + $scope.book.code, {withCredentials: true})
      //   .success(function (response) {
      //     $scope.existedFiles = response;
      //   })
      $scope.fileSaving = false;
      // $scope.bookFragment = response;
      $scope.book.upl_itemFile = null;
    };

    uploaderFile.onErrorItem = function(fileItem, response, status, headers) {
      $scope.fileSaving = false;
      $scope.book.upl_itemFile = null;
      alert("При загрузке файла на сервер возникла ошибка");
    };

  });
