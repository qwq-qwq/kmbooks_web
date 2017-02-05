/**
 * Created by sergey on 06.02.17.
 */

angular.module('angularApp').directive('bkNewsTile', [function() {
  return {
    restrict: 'E',
    scope: {
      news: '='
    },
    templateUrl: 'views/bk_news_tile.html'
  };
}])
