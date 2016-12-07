'use strict';
angular.module('angularApp')
  .controller('BannersEditTableCtrl', function($scope, $http, $location, FileUploader, $route, $timeout, config) {
    $scope.editing = 1;

    $scope.uploader = new FileUploader({
      url: config.url() + '/api/edit/banner_upload',
      removeAfterUpload: true,
      withCredentials: true
    });
    var uploader = $scope.uploader;

    $http.get(config.url() + "/api/banners")
      .success(function(response) {
        for(var k in response) {
          response[k].editing = false;
          response[k].row_id = k;
        }
        $scope.banners = response;
      })

    $scope.SortChanged = false;

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


    $scope.doneEditing = function (item) {
         var banner = {id: item.id, header: item.header, image: item.image};
         item.editing = false;
         $http.post(config.url() + "/api/edit/banner_update", banner, {withCredentials: true})
           .success(function(response) {
             item.id = response.id;
             $scope.UpdateId(item.row_id, item.id);
             if (typeof item.upl_item != 'undefined'){
               item.upl_item.formData[0].id = response.id;
               item.upl_item.upload();
             }
             $scope.SaveSort();
           });
    }

    $scope.AddItem = function () {
      function getRandomId() {
        return Math.floor((Math.random()*10000)+1)+1000;
      }
      var banner = {id: '', row_id: getRandomId(), id_banner: 0, header: '', image: '', editing: true};
      $scope.banners.unshift(banner);
    }

    $scope.deleteItem = function (item) {
      $http.post(config.url() + "/api/edit/banner_delete", item, {withCredentials: true})
        .success(function(response) {
          for (var k in $scope.banners) {
            if ($scope.banners[k].row_id == item.row_id) {
              $scope.banners.splice(k, 1);
              break;
            }
          }
          $scope.SaveSort();
        })
    }

    uploader.onAfterAddingFile = function(fileItem) {
      for(var k in $scope.banners) {
        if ($scope.banners[k].row_id == fileItem.formData[0].row_id){
          $scope.editing ++;
          $scope.banners[k].upl_item = fileItem;
          $scope.banners[k].editing = true;
        }
      }
    };

    uploader.onSuccessItem = function(fileItem, response, status, headers) {
      for(var k in $scope.banners) {
        if ($scope.banners[k].row_id == fileItem.formData[0].row_id){
          $scope.banners[k].image = '/img/' + fileItem.file.name;
          $scope.banners[k].upl_item = null;
        }
      }
    };

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
      alert("Ошибка добавления файла, разрешены только изображения");
    };

    uploader.onErrorItem = function(fileItem, response, status, headers) {
      for(var k in $scope.banners) {
        if ($scope.banners[k].row_id == fileItem.formData[0].row_id){
          $scope.banners[k].upl_item = null;
        }
      }
      alert("При загрузке файла на сервер возникла ошибка");
    };

    $scope.sortableOptions = {
      stop: function(e, ui) {
         $scope.SortChanged = true;
      }
    };

    $scope.UpdateId = function(row_id, id){
      for(var k in $scope.banners) {
        if ($scope.banners[k].row_id == row_id){
          $scope.banners[k].id = id;
        }
      }
    }

    $scope.SaveSort = function(){
      var banners = [];
      for(var k in $scope.banners) {
         banners.push({id: $scope.banners[k].id, id_banner: k});
      }
      $http.post(config.url() + "/api/edit/banner_sort_update", banners, {withCredentials: true})
        .success(function(response) {
           $scope.SortChanged = false;
        });
    }

  });
