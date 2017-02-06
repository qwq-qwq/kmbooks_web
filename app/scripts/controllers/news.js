/**
 * Created by sergey on 06.02.17.
 */
angular.module('angularApp')
  .controller('NewsCtrl', function ($scope, $http, $location, Lightbox, config, $sce) {
    var id = $location.search().id;

    function compare_desc(a,b) {
      if (a.date > b.date)
        return -1;
      else if (a.date < b.date)
        return 1;
      else
        return 0;
    }

    $http.get(config.url() + '/api/news/get_news_by_id?id=' + id)
      .success(function (response) {
        $scope.news = response;
        angular.forEach(response, function(value, key) {
          if (value.videoLink !== undefined) {
            value.sceLink = $sce.trustAsResourceUrl(value.videoLink);
          }
        });
      })

    $http.get(config.url() + "/api/news")
      .success(function(response) {
        $scope.allNews = response.sort(compare_desc).splice(0, 12);
      })
  });
