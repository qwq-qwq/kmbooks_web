/**
 * Created by sergey on 14.03.17.
 */
'use strict';

angular.module('angularApp').directive('bkElBooksButtons', ['$window', 'authorization', '$http', 'config', function($window, authorization, $http, config) {
  return {
    restrict: 'E',
    templateUrl: 'views/bk_el_books_buttons.html',
    link: function(scope, element, attributes) {
      scope.DownloadElBook = function (elBookLink, bookFormat) {
        $window.open('http://api.kmbooks.com.ua/api/user/files_for_book/get_el_book?link=' + elBookLink + '&format=' + bookFormat, {withCredentials: true});
      }
      scope.GetAvailableFormats = function (code) {
        if (authorization.isAuthorized()){
          $http.get(config.url() + '/api/user/files_for_book/get_file_formats_by_code?code=' + code, {withCredentials: true})
            .success(function (response) {
              scope.existedFormats = response;
            })
        }
      }

    }
  };
}])
