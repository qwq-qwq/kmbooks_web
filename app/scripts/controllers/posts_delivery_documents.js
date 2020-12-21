'use strict';

angular.module('angularApp')
  .controller('PostDeliveryDocsCtrl', function($scope, $http, $location, $route, config, authorization, utils, FileUploader) {

    $scope.selectors = {};
    $scope.kindOfPosts = ['Новая почта', 'Укр. почта'];
    $scope.dateEnd = new Date(new Date().getTime() + 1 * 1000 * 60 * 60 * 24); //taking tomorrow date for covering current day
    $scope.dateStart = new Date($scope.dateEnd - 10 * 1000 * 60 * 60 * 24);

    $scope.updateDocumentsTable = function () {
      var link = '';
      var dateStart, dateEnd;
      $scope.saving = true;
      $scope.styleOrdersList = {opacity: 0.2};
      dateStart = $scope.dateStart.getDate().toString() + "." + ("0" +($scope.dateStart.getMonth() + 1).toString()).slice(-2) + "." + $scope.dateStart.getFullYear().toString();
      dateEnd = $scope.dateEnd.getDate().toString() + "." + ("0" +($scope.dateEnd.getMonth() + 1).toString()).slice(-2) + "." + $scope.dateEnd.getFullYear().toString();

      if ($scope.intDocNumber) {
        link += "&intDocNumber=" + $scope.intDocNumber;
      }else{
        if ($scope.dateStart && $scope.dateEnd) {
          link = "dateStart=" + dateStart + "&dateEnd=" + dateEnd;
        }
        // if ($scope.selectors.orderStateFilter && $scope.selectors.orderStateFilter != 'Всі') {
        //   link += "&OrderState=" + $scope.selectors.orderStateFilter;
        // }
      }
        if ($scope.selectors.kindOfPost == "Новая почта") {
          $scope.newPostDocuments = undefined;
          $http.get(config.url() + "/api/new_post_documents?" + link, {withCredentials: true})
            .success(function (response) {
              for(var k in response) {
                response[k].editing = false;
                response[k].row_id = k;
              }
              $scope.newPostDocuments = response;
            })
        }


          $http.get(config.url() + "/api/ukr_post_documents?" + link, {withCredentials: true})
            .success(function (response) {
              for(var k in response) {
                response[k].editing = false;
                response[k].row_id = k;
              }
              $scope.ukrPostDocuments = response;
            })

          $scope.styleOrdersList = {opacity: 1};
          $scope.saving = false;

    }

    $scope.fromUnixTime = function(UnixTime) {
      return utils.fromUnixTime(UnixTime);
    }

    $scope.toDateTime = function(ObjId) {
      return utils.toDateTime(ObjId);
    }

    $scope.uploaderFile = new FileUploader({
      url: config.url() + '/api/ukr_post_documents/upload',
      removeAfterUpload: true,
      withCredentials: true
    });
    var uploaderFile = $scope.uploaderFile;

    $scope.saveFileItem = function () {
      $scope.fileSaving = true;
      // $scope.upl_itemFile.formData[0].type = "ukr_post_numbers";
      $scope.upl_itemFile.upload();
    }

    uploaderFile.onAfterAddingFile = function(fileItem) {
      $scope.upl_itemFile = fileItem;
    };

    uploaderFile.onSuccessItem = function(fileItem, response, status, headers) {
      $http.get(config.url() + "/api/ukr_post_documents", {withCredentials: true})
        .success(function (response) {
          for(var k in response) {
            response[k].editing = false;
            response[k].row_id = k;
          }
          $scope. ukrPostDocuments = response;
        })
      $scope.fileSaving = false;
      $scope.upl_itemFile = null;
    };

    uploaderFile.onErrorItem = function(fileItem, response, status, headers) {
      $scope.fileSaving = false;
      $scope.upl_itemFile = null;
      alert("При загрузке файла на сервер возникла ошибка");
    };

  });
