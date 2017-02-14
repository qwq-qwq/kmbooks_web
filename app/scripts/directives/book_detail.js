'use strict';

angular.module('angularApp').directive('bkBookDetail', ['$http', 'config', 'authorization', '$location', function($http, config, authorization, $location) {
  return {
    restrict: 'E',
    scope: {
       book: '='
    },
    templateUrl: 'views/bk_book_detail.html',
    link: function(scope, element, attributes) {
      scope.$watch('book.opened', function () {
        if (!scope.book.opened) return;
        scope.proceedSearch = true;
        $http.get(config.url() + "/api/books/description?code=" + scope.book.code)
          .success(function(response) {
              scope.description = response.text.replace(/([^>])\n/g, '$1<br/>') ; //nl2br
              scope.proceedSearch = false;
          })
      }, true)
      scope.isUser = function() {
        return authorization.isUser();
      }
      scope.isBookPage = function() {
        if ($location.path().search('book') != -1) {
          return true
        }else{
          return false}
      }
    }
  };
}])
