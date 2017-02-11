/**
 * Created by Desster on 17.09.2015.
 */

'use strict';

angular.module('angularApp')
  .controller('BooksTableCtrl', function($scope, $http, $location, config, $route) {
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
          /*angular.forEach(response.covers, function (cover, key) {
            if (cover.name !== null){
              if (cover.name.search("'") !== -1) {
                cover.name = cover.name.replace(/[\\"']/g, '\\$&');//.replace(/\u0000/g, '\\0');
              }
            }
          })*/

          $scope.languages = response.languages;
          if ($location.search().priceFrom == undefined && $location.search().priceTo == undefined) {
            $scope.priceSliderValue = [response.priceFrom, response.priceTo];
          }

          $scope.filters = {};
          var authorsFromUrl = $location.search().authors;
          if (authorsFromUrl !== undefined){
            $scope.filters.authorChecked = {};
            var authors = authorsFromUrl.split(',');
            angular.forEach(authors, function (authorFromUrl, key) {
              angular.forEach($scope.authors, function (value, key) {
                if (value.name === authorFromUrl) {
                  $scope.filters.authorChecked['value' + (key - 1)] = value.name;
                }
              })
            })
          }

          var seriesFromUrl = $location.search().series;
          if (seriesFromUrl !== undefined){
            $scope.filters.seriesChecked = {};
            var series = seriesFromUrl.split(',');
            angular.forEach(series, function (seriesFromUrl, key) {
              angular.forEach($scope.series, function (value, key) {
                if (value.name === seriesFromUrl) {
                  $scope.filters.seriesChecked['value' + (key - 1)] = value.name;
                }
              })
            })
          }

          var coversFromUrl = $location.search().covers;
          if (coversFromUrl !== undefined){
            $scope.filters.coversChecked = {};
            var covers = coversFromUrl.split(',');
            angular.forEach(covers, function (coverFromUrl, key) {
              angular.forEach($scope.covers, function (value, key) {
                if (value.name === coverFromUrl) {
                  $scope.filters.coversChecked['value' + (key - 1)] = value.name;
                }
              })
            })
          }

          var languagesFromUrl = $location.search().languages;
          if (languagesFromUrl !== undefined){
            $scope.filters.languagesChecked = {};
            var languages = languagesFromUrl.split(',');
            angular.forEach(languages, function (languageFromUrl, key) {
              angular.forEach($scope.languages, function (value, key) {
                if (value.name === languageFromUrl) {
                  $scope.filters.languagesChecked['value' + (key - 1)] = value.name;
                }
              })
            })
          }
          $scope.catalog();
        })
    }

    if ($location.path() == '/bestsellers') {
      $scope.myTitle = 'Бестселери';
      $scope.myHeader = 'Бестселери';
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
          if ($location.search().priceFrom == undefined && $location.search().priceTo == undefined) {
            $scope.priceSliderValue = [response.priceFrom, response.priceTo];
          }
          $scope.filters = {};
          $scope.catalog();
        })
    }

    if ($location.path() == '/novelties') {
      $scope.myTitle = 'Новинки';
      $scope.myHeader = 'Новинки';
      $http.get(config.url() + "/api/books/novelties_all")
        .success(function(response) {
          for (var key in response) {
            if (response[key].image == '') {
              response[key].image = '/img/no_picture_ru_165.jpg';
            }
          }
          $scope.books = response;
        })
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

    $scope.authorFilterApply = function () {
      $location.search('page', 1);
      var authorSearch = '';
      angular.forEach($scope.filters.authorChecked, function (author, key) {
        if(authorSearch !== ''){
          authorSearch += ',';
        }
        if (author !== undefined) {
          authorSearch += author;
        }
      })
      if (authorSearch === ''){
        $location.search('authors', undefined);
      }else{
        $location.search('authors', authorSearch);
      }
      $scope.catalog();
    }

    $scope.seriesFilterApply = function () {
      $location.search('page', 1);
      var seriesSearch = '';
      angular.forEach($scope.filters.seriesChecked, function (series, key) {
        if(seriesSearch !== ''){
          seriesSearch += ',';
        }
        if (series !== undefined) {
          seriesSearch += series;
        }
      })
      if (seriesSearch === ''){
        $location.search('series', undefined);
      }else{
        $location.search('series', seriesSearch);
      }
      $scope.catalog();
    }

    $scope.coversFilterApply = function () {
      $location.search('page', 1);
      var coversSearch = '';
      angular.forEach($scope.filters.coversChecked, function (covers, key) {
        if(coversSearch !== ''){
          coversSearch += ',';
        }
        if (covers !== undefined) {
          coversSearch += covers;
        }
      })
      if (coversSearch === ''){
        $location.search('covers', undefined);
      }else{
        $location.search('covers', coversSearch);
      }
      $scope.catalog();
    }

    $scope.languagesFilterApply = function () {
      $location.search('page', 1);
      var languagesSearch = '';
      angular.forEach($scope.filters.languagesChecked, function (language, key) {
        if(languagesSearch !== ''){
          languagesSearch += ',';
        }
        if (language !== undefined) {
          languagesSearch += language;
        }
      })
      if (languagesSearch === ''){
        $location.search('languages', undefined);
      }else{
        $location.search('languages', languagesSearch);
      }
      $scope.catalog();
    }

    $scope.removeFromAuthorFilter = function (nameInModel) {
      angular.forEach($scope.filters.authorChecked, function (author, key) {
        if(key === nameInModel){
          $scope.filters.authorChecked[key] = undefined;
        }
      })
      $scope.authorFilterApply();
    }

    $scope.removeFromSeriesFilter = function (nameInModel) {
      angular.forEach($scope.filters.seriesChecked, function (author, key) {
        if(key === nameInModel){
          $scope.filters.seriesChecked[key] = undefined;
        }
      })
      $scope.seriesFilterApply();
    }

    $scope.removeFromCoversFilter = function (nameInModel) {
      angular.forEach($scope.filters.coversChecked, function (cover, key) {
        if(key === nameInModel){
          $scope.filters.coversChecked[key] = undefined;
        }
      })
      $scope.coversFilterApply();
    }

    $scope.removeFromLanguagesFilter = function (nameInModel) {
      angular.forEach($scope.filters.languagesChecked, function (language, key) {
        if(key === nameInModel){
          $scope.filters.languagesChecked[key] = undefined;
        }
      })
      $scope.languagesFilterApply();
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
    });

    $scope.goToPage = function (page) {
      $location.search('page', page);
      $scope.catalog();
    }

  });

