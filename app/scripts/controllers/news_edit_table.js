/**
 * Created by sergey on 05.02.17.
 */
angular.module('angularApp')
  .controller('NewsCtrl', function($scope, $http, $location, FileUploader, $route, $timeout, config) {
    $scope.editing = 1;
    $scope.cropSelection = {src:"", selection: [], thumbnail: false};

    function compare_desc(a,b) {
      if (a.when > b.when)
        return -1;
      else if (a.when < b.when)
        return 1;
      else
        return 0;
    }

    $scope.uploader = new FileUploader({
      url: config.url() + '/api/edit/news/upload_files',
      removeAfterUpload: true,
      withCredentials: true
    });
    var uploader = $scope.uploader;

    $http.get(config.url() + "/api/news")
      .success(function(response) {
        for(var k in response) {
          response[k].editing = false;
          response[k].row_id = k;
        }
        //response.sort(compare_desc);
        $scope.news = response;
      })

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
      item.editing = false;
      var news = {id: item.id, title: item.title, date: item.date, text: item.text, videoLink: item.videoLink,
                  colorSchema: item.colorSchema, bookCodes: item.bookCodes};
      $http.post(config.url() + "/api/edit/news/update", news, {withCredentials: true})
        .success(function(response) {
          item.id = response.id;
          if (typeof item.upl_item != 'undefined'){
            item.upl_item.formData[0].id = response.id;
            item.upl_item.formData[0].rectangle = [$scope.cropSelection.selection[0],
                                                   $scope.cropSelection.selection[1],
                                                   $scope.cropSelection.selection[4],
                                                   $scope.cropSelection.selection[5]];
            item.upl_item.upload();
          }
        });
    }

    $scope.AddItem = function () {
      function getRandomId() {
        return Math.floor((Math.random()*10000)+1)+1000;
      }
      var news = {id: '', row_id: getRandomId(), title: '', date: new Date(), text: '', videoLink: '',
                  colorSchema: {}, bookCodes: '', editing: true};
      $scope.news.unshift(news);
    }

    $scope.deleteItem = function (item) {
      $http.post(config.url() + "/api/edit/news/delete", item, {withCredentials: true})
        .success(function(response) {
          for (var k in $scope.news) {
            if ($scope.news[k].row_id == item.row_id) {
              $scope.news.splice(k, 1);
              break;
            }
          }
        })
    }

    $scope.open1 = function() {
      $scope.popup1.opened = true;
    };

    $scope.popup1 = {
      opened: false
    };

    uploader.onAfterAddingFile = function(fileItem) {
      for(var k in $scope.news) {
        if ($scope.news[k].row_id == fileItem.formData[0].row_id){
          $scope.editing ++;
          $scope.news[k].upl_item = fileItem;
          $scope.news[k].editing = true;
        }
      }
    };

    uploader.onSuccessItem = function(fileItem, response, status, headers) {
      for(var k in $scope.news) {
        if ($scope.news[k].row_id == fileItem.formData[0].row_id){
          $scope.news[k].image = '/img/' + fileItem.file.name;
          $scope.news[k].upl_item = null;
        }
      }
    };

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
      alert("Ошибка добавления файла, разрешены только изображения");
    };

    uploader.onErrorItem = function(fileItem, response, status, headers) {
      for(var k in $scope.news) {
        if ($scope.news[k].row_id == fileItem.formData[0].row_id){
          $scope.news[k].upl_item = null;
        }
      }
      alert("При загрузке файла на сервер возникла ошибка");
    };

  });
