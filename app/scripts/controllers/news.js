/**
 * Created by sergey on 06.02.17.
 */
angular.module('angularApp')
  .controller('NewsCtrl', function ($scope, $http, $location, config, $sce, pageTitle, $window) {
    var id = $location.search().id;
    if (id === ''){
      $location.url('/news_list')
    }

    $scope.absUrl = $location.absUrl();

    $http.get(config.url() + '/api/news/get_news_by_id?id=' + id)
      .success(function (response) {
        $scope.news = response;
        if ($scope.news.videoLink !== '') {
          $scope.news.sceLink = $sce.trustAsResourceUrl($scope.news.videoLink);
        }
        if ($scope.news.secondImage !== null) {
          $scope.news.image = $scope.news.secondImage;
        }
        pageTitle.SetTitle($scope.news.title);
        pageTitle.SetDescription('Інтернет-магазин kmbooks.com.ua: ' + $scope.news.text.substring(0, 300));
        if ($scope.news !== undefined &&
          $scope.news.bookCodes !== null &&
          $scope.news.bookCodes !== ''){
          $http.get(config.url() + "/api/books/search?code=" + $scope.news.bookCodes)
            .success(function(response) {
              $scope.books = response.bookList;
            })
        }
      })

    $http.get(config.url() + "/api/news/get_last_twelve")
      .success(function(response) {
        $scope.allNews = response;
      })

  });
