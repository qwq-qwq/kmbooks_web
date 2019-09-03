/**
 * Created by sergey on 06.02.17.
 */
angular.module('angularApp')
  .controller('NewsCtrl', function ($scope, $http, $location, config, $sce, pageTitle, $window) {
    var id = $location.search().id;
    if (id === ''){
      $location.url('/news_list')
    }
    $scope.showIframe = false;
    $scope.absUrl = $location.absUrl();

    $http.get(config.url() + '/api/news/get_news_by_id?id=' + id)
      .success(function (response) {
        var news = response;
        $scope.videoLink = news.videoLink;
        if ($scope.videoLink !== '') {
          news.sceLink = $sce.trustAsResourceUrl(news.videoLink);
          $scope.showIframe = true;
        }
        if (news.secondImage !== null) {
          news.image = news.secondImage;
        }
        pageTitle.SetTitle(news.title);
        pageTitle.SetDescription('Інтернет-магазин kmbooks.com.ua: ' + news.text.substring(0, 300));
        $scope.news = news;
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
