/**
 * Created by sergey on 05.02.17.
 */
angular.module('angularApp')
  .controller('NewsEditCtrl', function($scope, $http, $location, FileUploader, $route, $timeout, config) {
    $scope.editing = 1;
    $scope.cropSelection = {src:"", selection: [], thumbnail: false};
    $scope.cropSelectionSecond = {src:"", selection: [], thumbnail: false};

    $scope.uploader = new FileUploader({
      url: config.url() + '/api/edit/news/upload_files',
      removeAfterUpload: true,
      withCredentials: true
    });
    var uploader = $scope.uploader;
    $scope.getNews = function () {
      var page = $location.search().page;
      if (page === undefined){
        page = 1;
      }else{
        page = parseInt(page);
      };
      $http.get(config.url() + "/api/edit/news?page=" + (page - 1), {withCredentials: true})
        .success(function(response) {
          var newsList = response.newsList;
          for(var k in newsList) {
            newsList[k].editing = false;
            newsList[k].row_id = k;
          }
          //response.sort(compare_desc);
          $scope.news = newsList;
          $scope.newsCount = response.countInList;

          $scope.pages = [];
          var pagesCount = Math.ceil($scope.newsCount / 42);
          var startPage = 1;
          if (page <= 4) {
            startPage = 1;
          }else{
            startPage = page - 4;
          }
          var endPage = 10;
          if (pagesCount > 10) {
            if (page > 5){
              if ((page + 4) > pagesCount) {
                endPage = pagesCount;
              }else{
                endPage = page + 4;
              }
            }else{
              endPage = 10;
            }
          }else{
            endPage = pagesCount;
          }
          for(var i = startPage; i <= endPage; i++){
            var active = false;
            if (page == i) {
              active = true;
            }
            $scope.pages.push({page: i, url: "/news_edit_table?page=" + i, active: active})
          }
          var pagePrevious = page > 2 ? page - 1: 1;
          var pageNext = page < pagesCount ? page + 1: pagesCount;
          $scope.pagePrevious = "/news_edit_table?page=" + pagePrevious;
          $scope.pageNext = "/news_edit_table?page=" + pageNext;
        })
    }
    $scope.getNews();

    uploader.filters.push({
      name: 'imageFilter',
      fn: function(item /*{File|FileLikeObject}*/, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    $scope.editItem = function (item) {
      $http.get(config.url() + '/api/news/get_news_by_id?id=' + item.id)
        .success(function (response) {
          item.text = response.text;
        })
      item.editing = true;
      item.is_second = false;
    }

    $scope.doneEditing = function (item) {
      item.editing = false;
      var news = {id: item.id,
               title: item.title,
                date: item.date,
              hidden: item.hidden,
                text: item.text,
           videoLink: item.videoLink,
         colorSchema: item.colorSchema,
           bookCodes: item.bookCodes,
          viewsCount: item.viewsCount,
          };
      $http.post(config.url() + "/api/edit/news/update", news, {withCredentials: true})
        .success(function(response) {
          item.id = response.id;
          if (typeof item.upl_item != 'undefined'){
            item.upl_item.formData[0].id = response.id;
            item.upl_item.formData[0].rectangle = [$scope.cropSelection.selection[0],
                                                   $scope.cropSelection.selection[1],
                                                   $scope.cropSelection.selection[4],
                                                   $scope.cropSelection.selection[5]];
            item.upl_item.formData[0].is_video = (item.videoLink.length > 0) ? true : false;
            item.upl_item.formData[0].is_second = item.is_second;
            item.upl_item.upload();
          }
        });
    }

    $scope.AddItem = function () {
      function getRandomId() {
        return Math.floor((Math.random()*10000)+1)+1000;
      }
      var news = {id: '', row_id: getRandomId(), title: '', date: new Date(), hidden: true,
                  text: '', videoLink: '',
                  colorSchema: {}, bookCodes: '', editing: true, is_second: false};
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
          if (!$scope.news[k].is_second){
            $scope.news[k].image = response.image;
          }else{
            $scope.news[k].secondImage = response.secondImage;
          }
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

    $scope.goToPage = function (page) {
      $location.search('page', page);
      $scope.getNews();
    }

  });
