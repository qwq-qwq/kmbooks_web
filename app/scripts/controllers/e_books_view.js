/**
 * Created by sergey on 04.02.17.
 */

'use strict';

angular.module('angularApp')
  .controller('EBooksViewCtrl', function($scope, $http, $rootScope, $anchorScroll, $route, config, utils, elBooks) {

      $scope.elBooks = elBooks.GetElBooks();
      if($scope.elBooks == undefined){
        elBooks.GetStoredElBooks();
      }
      $rootScope.$on('el_books_has_added', function () {
        $scope.elBooks = elBooks.GetElBooks();
      })

  });
