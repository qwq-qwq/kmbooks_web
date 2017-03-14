/**
 * Created by sergey on 06.02.17.
 */
'use strict';

angular.module('angularApp').directive('bkNewsTile', ['utils', function(utils) {
  return {
    restrict: 'E',
    scope: {
      news: '='
    },
    templateUrl: 'views/bk_news_tile.html',
    link: function(scope, element, attributes) {
      scope.colorSchema = utils.GetRandomColorSchema();
      scope.$watch('colorSchema', function () {
        scope.NewsColorSchema = {'background-color': scope.colorSchema.background, color: scope.colorSchema.text};
      })
    }
  };
}])
