'use strict';

	angular.module('angularApp')
  .controller('SearchCtrl', function($scope, $http, $location, config) {
    $scope.searchString = "";
    $scope.isSelectedAllShops = function() {
       if ($scope.selectedShop == 'Все магазины') {
         return true
       }else{
         return false}
    }

    $http.get(config.url() + "/api/books/shops")
       .success(function(response) {
          $scope.shops = response;
          $scope.selectedShop = $scope.shops[0].id;
          var autor = $location.search().autor;
          if (autor !== ''){
            $scope.autor = autor;
            $scope.my_search();
          }
    })

    $scope.my_search = function() {
      $scope.books = "";
      $scope.proceedSearch = true;
    	var link = '';
    	if ($scope.name && $scope.name.length > 2) {
             link += "name=" + $scope.name;
    	}
    	if ($scope.autor) {
             link += "&autor=" + $scope.autor;
    	}
    	if ($scope.isbn) {
             link += "&isbn=" + $scope.isbn;
    	}
    	if ($scope.code) {
             link += "&code=" + $scope.code;
    	}
      $scope.searchString = link;
      if (link == ''){
        $scope.books = "";
        $scope.proceedSearch = false;
        return
      }
    	if ($scope.selectedShop != 'Все магазины') {
             link += "&shop=" + $scope.selectedShop;
    	}
      $http.get(config.url() + "/api/books/search?"+link)
        .success(function(response) {
          for (var key in response) {
            if (response[key].image == '') {
               response[key].image = '/img/no_picture_ru_165.jpg';
            }
            response[key].opened = false;
          }
        	$scope.books = response;
          $scope.proceedSearch = false;
        })
    }
  });
