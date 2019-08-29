/**
 * Created by sergey on 26.02.17.
 */
angular.module('angularApp')
  .controller('NewsListCtrl', function ($scope, $http, $location, config, $sce) {

    function compare_desc(a,b) {
      if (a.date > b.date)
        return -1;
      else if (a.date < b.date)
        return 1;
      else
        return 0;
    }

    $http.get(config.url() + "/api/news")
      .success(function(response) {
        $scope.news = response.newsList.sort(compare_desc);
      })
  });
