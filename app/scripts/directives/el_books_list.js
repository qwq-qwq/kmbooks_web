/**
 * Created by sergey on 14.03.17.
 */

'use strict';

angular.module('angularApp').directive('bkElBooksList', ['$http', 'config', 'authorization', '$location', function($http, config, authorization, $location) {
  return {
    restrict: 'E',
    templateUrl: 'views/bk_el_books_list.html',
    link: function(scope, element, attributes) {
      scope.$watch('existedFiles', function () {
      })
    }
  };
}])

