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
        if (authorization.isUser()){
          $http.get(config.url() + "/api/user/get_item_prop_table?code=" + scope.book.code, {withCredentials: true})
            .success(function (response) {
              scope.remains = response;
              scope.proceedSearch = false;
            })
        }else{
          $http.get(config.url() + "/api/books/remains?code=" + scope.book.code)
            .success(function (response) {
              scope.remains = response;
              scope.proceedSearch = false;
            })
        }
        $http.get(config.url() + "/api/books/description?code=" + scope.book.code)
          .success(function(response) {
              scope.description = response.text.replace(/([^>])\n/g, '$1<br/>') ; //nl2br
          })
        scope.isUser = function() {
          return authorization.isUser();
        }
        scope.isBookPage = function() {
          if ($location.path().search('book_view') != -1) {
            return true
          }else{
            return false}
        }
      }, true)}
  };
}])
