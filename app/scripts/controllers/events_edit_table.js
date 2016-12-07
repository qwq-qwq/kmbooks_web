angular.module('angularApp')
  .controller('EventsEditTableCtrl', function($scope, $http, $location, FileUploader, $route, $timeout, config) {
    $scope.editing = 1;

    function compare_desc(a,b) {
      if (a.when > b.when)
        return -1;
      else if (a.when < b.when)
        return 1;
      else
        return 0;
    }

    $scope.uploader = new FileUploader({
      url: config.url() + '/api/edit/upload_files',
      removeAfterUpload: true,
      withCredentials: true
    });
    var uploader = $scope.uploader;

    $http.get(config.url() + "/api/events")
    .success(function(response) {
      for(var k in response) {
        response[k].editing = false;
        response[k].row_id = k;
      }
      response.sort(compare_desc);
      $scope.events = response;
    })

    uploader.filters.push({
      name: 'imageFilter',
      fn: function(item /*{File|FileLikeObject}*/, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    $http.get(config.url() + "/api/gmaps")
      .success(function (response) {
        $scope.gmap = response;
        $scope.gmap.unshift({name: "Без метки", sprut_code: 0});
      })

    $scope.editItem = function (item) {
      item.editing = true;
    }

    $scope.doneEditing = function (item) {
      item.editing = false;
      var event = {id: item.id, title: item.title, where: item.where, when: item.when, end: item.end, text: item.text, codeShop: item.codeShop};
      $http.post(config.url() + "/api/edit/event_update", event, {withCredentials: true})
        .success(function(response) {
            item.id = response.id;
            if (typeof item.upl_item != 'undefined'){
                item.upl_item.formData[0].id = response.id;
                item.upl_item.upload();
            }
        });
    }

    $scope.AddItem = function () {
      function getRandomId() {
        return Math.floor((Math.random()*10000)+1)+1000;
      }
      var event = {id: '', row_id: getRandomId(), title: '', where: '', when: new Date(), end: new Date(), text: '', editing: true};
      $scope.events.unshift(event);
    }

    $scope.deleteItem = function (item) {
      $http.post(config.url() + "/api/edit/event_delete", item, {withCredentials: true})
        .success(function(response) {
          for (var k in $scope.events) {
            if ($scope.events[k].row_id == item.row_id) {
              $scope.events.splice(k, 1);
              break;
            }
          }
      })
    }

    $scope.chooseShop = function(gma, event) {
      for (var k in $scope.events) {
        if ($scope.events[k].row_id == event.row_id) {
          $scope.events[k].where = gma.name;
          $scope.events[k].codeShop = gma.sprut_code;
          break;
        }
      }
    };

    $scope.open1 = function() {
      $scope.popup1.opened = true;
    };

    $scope.popup1 = {
      opened: false
    };

    uploader.onAfterAddingFile = function(fileItem) {
      for(var k in $scope.events) {
        if ($scope.events[k].row_id == fileItem.formData[0].row_id){
           $scope.editing ++;
           $scope.events[k].upl_item = fileItem;
           $scope.events[k].editing = true;
        }
      }
    };

    uploader.onSuccessItem = function(fileItem, response, status, headers) {
      for(var k in $scope.events) {
        if ($scope.events[k].row_id == fileItem.formData[0].row_id){
          $scope.events[k].image = '/img/' + fileItem.file.name;
          $scope.events[k].upl_item = null;
        }
      }
    };

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
      alert("Ошибка добавления файла, разрешены только изображения");
    };

    uploader.onErrorItem = function(fileItem, response, status, headers) {
      for(var k in $scope.events) {
        if ($scope.events[k].row_id == fileItem.formData[0].row_id){
          $scope.events[k].upl_item = null;
        }
      }
      alert("При загрузке файла на сервер возникла ошибка");
    };

});
