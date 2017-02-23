/**
 * Created by Desster on 17.09.2015.
 */

'use strict';

angular.module('angularApp')
  .controller('BooksTableCtrl', function(authorization, $scope, $http, $location, config, $route, $window) {
    function showFilters(filterFromUrl, filterCheckedName, filterValuesInScope) {
      if (filterFromUrl !== undefined){
        $scope.filters[filterCheckedName] = {};
        var filters = filterFromUrl.split(',');
        angular.forEach(filters, function (filterFromUrl, key) {
          angular.forEach(filterValuesInScope, function (value, key) {
            if (value.name === filterFromUrl) {
              $scope.filters[filterCheckedName]['value' + key] = value.name;
            }
          })
        })
      }
    }

    $scope.kindOfView = "tiles";
    if ($location.search().sortBy === ''){
      $location.search('sortBy', 'noveltiesFirst');
    }

    $scope.catalog = function () {
      var page = $location.search().page;
      var priceFrom = $location.search().priceFrom;
      var priceTo = $location.search().priceTo;
      $scope.filterAuthors = $location.search().authors;
      $scope.filterSeries = $location.search().series;
      $scope.filterCovers = $location.search().covers;
      $scope.filterLanguages = $location.search().languages;
      $scope.filterTranslators = $location.search().translators;
      $scope.filterEditors = $location.search().editors;
      $scope.filterPainters = $location.search().painters;
      $scope.filterIllustrations = $location.search().illustrations;
      $scope.filterAgeGroups = $location.search().ageGroups;
      $scope.filterSortBy = $location.search().sortBy;
      $scope.group = $location.search().group;
      if (page === undefined){
        page = 1;
      }else{
        page = parseInt(page);
      };
      $scope.page = page;
      if ($scope.group !== undefined) {
        $http.get(config.url() + "/api/get_catalog_element?group=" + $scope.group)
          .success(function(response) {
            $scope.myTitle = response.name;
            $scope.myHeader = response.name;
          });
      }
      if (priceFrom !== undefined && priceTo !== undefined) {
        $scope.priceSliderValue = [parseInt(priceFrom), parseInt(priceTo)];
      }
      $window.scrollTo(0, 0);
      $scope.searching = true;
    }

    if ($location.path() == '/catalog') {
      var filter = '';
      if ($location.search().group !== undefined) {
        filter = "?group=" + $location.search().group;
      }
      $http.get(config.url() + "/api/books/criteria" + filter)
        .success(function (response) {
          $scope.priceFrom = response.priceFrom;
          $scope.priceTo = response.priceTo;
          $scope.authors = response.authors;
          $scope.series = response.series;
          $scope.covers = response.covers;
          $scope.languages = response.languages;
          $scope.translators = response.translators;
          $scope.editors = response.editors;
          $scope.painters = response.painters;
          $scope.illustrations = response.illustrations;
          $scope.ageGroups = [];
          angular.forEach(response.ageGroups, function (element, key) {
            if (element.name !== null){
              if (element.name === 'Малюкам') {
                $scope.ageGroups[0] = element;
              }else if(element.name === 'Дошкільнятам'){
                $scope.ageGroups[1] = element;
              }else if(element.name === 'Молодшим школярам'){
                $scope.ageGroups[2] = element;
              }else if(element.name === 'Підліткам'){
                $scope.ageGroups[3] = element;
              }else if(element.name === 'Юнакам'){
                $scope.ageGroups[4] = element;
              }else if(element.name === 'Дорослим'){
                $scope.ageGroups[5] = element;
              }else if(element.name === 'Для всіх'){
                $scope.ageGroups[6] = element;
              }
            }
          })

          if ($location.search().priceFrom == undefined && $location.search().priceTo == undefined) {
            $scope.priceSliderValue = [response.priceFrom, response.priceTo];
          }

          $scope.filters = {};
          showFilters($location.search().authors, 'authorChecked', $scope.authors);
          showFilters($location.search().series, 'seriesChecked', $scope.series);
          showFilters($location.search().covers, 'coversChecked', $scope.covers);
          showFilters($location.search().languages, 'languagesChecked', $scope.languages);
          showFilters($location.search().translators, 'translatorsChecked', $scope.translators);
          showFilters($location.search().editors, 'editorsChecked', $scope.editors);
          showFilters($location.search().painters, 'paintersChecked', $scope.painters);
          showFilters($location.search().illustrations, 'illustrationsChecked', $scope.illustrations);
          showFilters($location.search().ageGroups, 'ageGroupsChecked', $scope.ageGroups);

          $scope.catalog();
        })
    }

    if ($location.path() == '/bestsellers') {
      $scope.myTitle = 'Бестселери';
      $scope.myHeader = 'Бестселери';
    }

    if ($location.path() == '/novelties') {
      $scope.myTitle = 'Новинки';
      $scope.myHeader = 'Новинки';
    }

    $scope.animateElementIn = function($el) {
      $el.removeClass('not-visible');
      $el.addClass('animated pulse'); // this example leverages animate.css classes
    };

    $scope.animateElementOut = function($el) {
      $el.addClass('not-visible');
      $el.removeClass('animated pulse'); // this example leverages animate.css classes
    };

    $scope.quoteString = function (strToQuote) {
      return strToQuote.replace(/[\\"']/g, '\\$&');
    }

    $scope.isCatalog = function() {
      if ($location.path().search('catalog') != -1) {
        return true
      }else{
        return false}
    }

    $scope.priceFilterApply = function () {
       $location.search('page', 1);
       if ($scope.priceSliderValue !== undefined) {
         $location.search('priceFrom', $scope.priceSliderValue[0]);
         $location.search('priceTo', $scope.priceSliderValue[1]);
       }
       $scope.catalog();
    }

    $scope.FilterApply = function (filterChecked, nameInUrl) {
      $location.search('page', 1);
      var filter = '';
      angular.forEach(filterChecked, function (filterItem, key) {
        if(filter !== ''){
          filter += ',';
        }
        if (filterItem !== undefined) {
          filter += filterItem;
        }
      })
      if (filter === ''){
        $location.search(nameInUrl, undefined);
      }else{
        $location.search(nameInUrl, filter);
      }
      $scope.catalog();
    }

    $scope.removeFromFilter = function (filterChecked, nameInModel, nameInUrl) {
      angular.forEach(filterChecked, function (author, key) {
        if(key === nameInModel){
          filterChecked[key] = undefined;
        }
      })
      $scope.FilterApply(filterChecked, nameInUrl);
    }

    $scope.filterEmpty = function(items) {
      var result = {};
      angular.forEach(items, function(value, key) {
        if (value !== undefined) {
          result[key] = value;
        }
      });
      return result;
    }

    $scope.setLayout = function (layout) {
      $scope.kindOfView = layout;
      $scope.searching = true;
    }

    $scope.setSortBy = function (sortBy) {
      $location.search('sortBy', sortBy);
      $scope.catalog();
    }

    $scope.$on('$routeUpdate', function(event, current) {
      if(current.params.group !== current.scope.group){
        $route.reload();
      }
      if(current.params.reload){
        $route.reload();
        $location.search('reload', false);
      }
    });

    $scope.goToPage = function (page) {
      $location.search('page', page);
      $scope.catalog();
    }

    $scope.isEditor = function() {
      return authorization.isEditor();
    }

  });

