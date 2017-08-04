'use strict';

angular.module('angularApp')
  .controller('HeaderCtrl', function(wishList, $scope, $rootScope, $location, $anchorScroll, $http,
                                     config, cart, cartPopover, subscribeDialog, callbackDialog,
                                     authorization, $window) {

    $scope.menu = [
      {label:'КОНТАКТИ', route:'/contacts'}
    ]

    $scope.templateUrl = 'views/cart_popover.html';

    $scope.menuActive = '/';

    $scope.updateSmCatalogVisible = function () {
      if (authorization.isAuthorized()) {
        $scope.catalogClass = "hidden-sm";
      }else{
        $scope.catalogClass = "";
      }
    }

    $scope.updateSmCatalogVisible();

    $rootScope.$on('successful_authorization', function () {
      $scope.updateSmCatalogVisible();
    })

    $rootScope.$on('successful_logout', function () {
      $scope.updateSmCatalogVisible();
    })

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
      $scope.myInterval = 6000;
      $scope.noWrapSlides = false;
      $scope.slides = [];
      $http.get(config.url() + "/api/banners")
        .success(function(response) {
          for (var key in response) {
              $scope.slides.push({id: response[key].id_banner, image:  response[key].image,
                header: response[key].header, link: response[key].link});
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
            strMenu += '<li><a href = "/catalog?group=' + response[key].group_id + '">' + response[key].name + caret_text + '</a>';
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
      if ($location.path().search('book') != -1) {
        return true
      }else{
        return false}
    }

    $scope.isContacts = function() {
      if ($scope.menuActive == '/contacts') {
        return true
      }else{
        return false}
    };

    $scope.ToggleCurtain = function() {
      $scope.showSearch = false;
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    $scope.toggleSearchMobile = function() {
      $scope.showSearch = !$scope.showSearch;
    };

    $scope.toggleSearch = function() {
      $scope.inputLengthRecalculation();
      $scope.showSearch = !$scope.showSearch;
    };

    $scope.searchReset = function() {
      $scope.showSearch = false;
      $scope.search_string = "";
    };

    $scope.searchGo = function() {
      $scope.showSearch = false;
      $location.search().search_string = $scope.search_string;
      $scope.search_string = "";
      $location.path('/search');
    };

    $scope.$on('$locationChangeStart', function(event) {
      $scope.isCollapsed = true;
    });

    $rootScope.$on('cart_was_added', function () {
      $scope.itemsCount = cart.ItemsCount();
      $scope.cart = cart.GetCart();
    })

    $rootScope.$on('wish_list_has_added', function () {
      $scope.wishListItemsCount = wishList.ItemsCount();
    })

    $scope.OnBannerClick = function (slide) {
      if (slide.link.indexOf('http://') === -1) {
        $location.url(slide.link);
      }else{
        $window.location.href = slide.link;
      }
      $scope.cartTooltipEnabled = false;
    }

    $scope.inputLengthRecalculation = function () {
      var headerLength = angular.element('#header').width();
      var rightMenuLength = angular.element('#right-menu').width();
      var searchInputLength = headerLength - 167 - 30 - rightMenuLength;
      $scope.searchInputStyle={width: searchInputLength};
    }

    $scope.openCartPopover = function () {
       cartPopover.ShowCart();
    }

    $scope.mouseEnter = function () {
      $scope.cartTooltipOpened = true;
    }

    $scope.mouseLeave = function () {
      $scope.cartTooltipOpened = false;
    }

    $scope.ShowSubscribeDialog = function () {
      subscribeDialog.Show();
    }

    $scope.ShowCallbackDialog = function () {
      callbackDialog.Show();
    }

  });


