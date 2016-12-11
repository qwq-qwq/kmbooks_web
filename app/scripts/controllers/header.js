'use strict';

angular.module('angularApp')
  .controller('HeaderCtrl', function($scope, $rootScope, $location, $anchorScroll, $http, config) {

    $scope.menu = [
      {label:'ГОЛОВНА', route:'/'},
      {label:'ПОДІЇ', route:'/events'},
      {label:'Пункти самовивозу', route:'/map'},
      {label:'ПОШУК ТОВАРІВ', route:'/search'},
      {label:'КОНТАКТИ', route:'/contacts'}
    ]

    $scope.menuActive = '/';

    $rootScope.$on('$viewContentLoaded', function(e, curr, prev) {
      $scope.menuActive = $location.path();
      if ($scope.menuActive == '/'){
        $scope.initSlider();
      }
    });

    $scope.removeDiv = function() {
      var pTags = $( ".carousel .item .item" );
      if ( pTags.parent().is( ".text-center" ) ) {
        pTags.unwrap();
      }
      return 0;
    }

    $scope.initSlider = function() {
      $scope.myInterval = 5000;
      $scope.noWrapSlides = false;
      $scope.slides = [];
      $http.get(config.url() + "/api/banners")
        .success(function(response) {
          for (var key in response) {
              $scope.slides.push({id: response[key].id_banner, image:  response[key].image, header: response[key].header});
          }
        })
    }

    $scope.isCollapsed = true;

    $scope.isMain = function() {
     if ($scope.menuActive == '/') {
       return true
     }else{
       return false}
    }

    $scope.isBookPage = function() {
      if ($location.path().search('book_view') != -1) {
        return true
      }else{
        return false}
    }

    $scope.isContacts = function() {
      if ($scope.menuActive == '/contacts') {
        return true
      }else{
        return false}
    }

  });


