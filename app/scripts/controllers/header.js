'use strict';

angular.module('angularApp')
  .controller('HeaderCtrl', function($scope, $rootScope, $location, $anchorScroll, $http, config) {

    $scope.menu = [
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

    $scope.initMenu = function () {
      $http.get(config.url() + "/api/get_catalog")
        .success(function(response) {
          var strMenu = "";
          var previous_level = 0;
          var current_level = 0;
          var count = 0;
          for (var key in response) {
            if (response[key].menu_code.substring(3) == '00.00'){
              current_level = 1;
            }else if (response[key].menu_code.substring(6) == '00'){
              current_level = 2;
            }else{
              current_level = 3;
            };
            if(current_level > previous_level){
              if (current_level > 1){
                response[key-1].is_parent = true;
              }
            }
            previous_level = current_level;
            response[key].level = current_level;
          };
          var previous_level = 0;
          var caret_text = '';
          for (var key in response) {
            current_level = response[key].level;
            if (response[key].is_parent === true) {
              caret_text = '<span class="caret"></span>';
            }else{
              caret_text = '';
            };
            if (current_level == previous_level) {
              strMenu += '</li>';
            }else if(current_level > previous_level){
              if (current_level > 1) {
                strMenu += '<ul class="dropdown-menu">';
              }
            }else{
              var diff = previous_level - current_level;
              if (diff == 1){
                strMenu += '</li>';
                strMenu += '</ul>';
                strMenu += '</li>';
              }else{
                strMenu += '</li>';
                strMenu += '</ul>';
                strMenu += '</li>';
                strMenu += '</li>';
                strMenu += '</ul>';
              };
            };
            strMenu += '<li><a href = "#/catalog?group_id=' + response[key].group_id + '">' + response[key].name + caret_text + '</a>';
            previous_level = current_level;
          };
          $scope.strMenu = strMenu;
          $scope.$broadcast('menuloaded');
        })
    };

    $scope.initMenu();

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


