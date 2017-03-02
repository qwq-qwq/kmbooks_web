/**
 * Created by sergey on 06.02.17.
 */
angular.module('angularApp')
  .controller('NewsCtrl', function ($scope, $http, $location, config, $sce, pageTitle) {
    var id = $location.search().id;

    $window.scrollTo(0, 0);

    function compare_desc(a,b) {
      if (a.date > b.date)
        return -1;
      else if (a.date < b.date)
        return 1;
      else
        return 0;
    }

    $http.get(config.url() + '/api/news/get_news_by_id?id=' + id)//
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
      })

    $http.get(config.url() + "/api/news/get_last_twelve")
      .success(function(response) {
        $scope.allNews = response.sort(compare_desc);
      })
  });
