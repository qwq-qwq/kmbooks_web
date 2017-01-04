'use strict';

/**
 * @ngdoc overview
 * @name angularApp
 * @description
 * # angularApp
 *
 * Main module of the application.
 */

angular
  .module('angularApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngMessages',
    'angularFileUpload',
    'bootstrapLightbox',
    'textAngular',
    'dynamicLayout',
    'ui.sortable',
    'ui.calendar',
    'angular-scroll-animate',
    'ui.bootstrap',
    'ui.bootstrap-slider'
  ])
  .config(function ($routeProvider) {

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/search', {
        templateUrl: 'views/search.html',
        controller: 'SearchCtrl'
      })
      .when('/detail_search', {
        templateUrl: 'views/detail_search.html',
        controller: 'DetailSearchCtrl'
      })
      .when('/map', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl'
      })
      .when('/requests_stat', {
        templateUrl: 'views/requests_stat.html',
        controller: 'RequestsStatCtrl'
      })
      .when('/log_last', {
        templateUrl: 'views/log.html',
        controller: 'LogTableCtrl'
      })
      .when('/bestsellers', {
        templateUrl: 'views/books_table.html',
        controller: 'BooksTableCtrl'
      })
      .when('/novelties', {
        templateUrl: 'views/books_table.html',
        controller: 'BooksTableCtrl'
      })
      .when('/book_view', {
        templateUrl: 'views/book_view.html',
        controller: 'BookViewCtrl'
      })
      .when('/events_edit_table', {
        templateUrl: 'views/events_edit_table.html',
        controller: 'EventsEditTableCtrl'
      })
      .when('/map_edit_table', {
        templateUrl: 'views/map_edit_table.html',
        controller: 'MapEditTableCtrl'
      })
      .when('/settings_edit_table', {
        templateUrl: 'views/settings_edit_table.html',
        controller: 'SettingsEditTableCtrl'
      })
      .when('/edit', {
        templateUrl: 'views/edit.html',
        controller: 'EditCtrl'
      })
      .when('/event_view', {
        templateUrl: 'views/event_view.html',
        controller: 'EventViewCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/events', {
        templateUrl: 'views/events_view.html',
        controller: 'EventsViewCtrl'
      })
      .when('/contacts', {
        templateUrl: 'views/contacts.html',
        controller: 'ContactsViewCtrl'
      })
      .when('/banners_edit_table', {
        templateUrl: 'views/banners_edit_table.html',
        controller: 'BannersEditTableCtrl'
      })
      .when('/update_by_call', {
        templateUrl: 'views/update_by_call.html',
        controller: 'UpdateByCallCtrl'
      })
      .when('/users_edit_table', {
        templateUrl: 'views/users_edit_table.html',
        controller: 'UsersEditTableCtrl'
      })
      .when('/catalog', {
        templateUrl: 'views/books_table.html',
        controller: 'BooksTableCtrl'
      })

      .otherwise({
        redirectTo: '/'
      });

  })
  .run(function (api) {
     api.init();
  })
  .factory('httpInterceptor', function($q, $location, $cookies){
      return {
        /*request: function(config) {
          var allowedMethods = ['GET'];
          if(allowedMethods.indexOf(config.method) === -1) {
            config.headers['CSRFToken'] = $cookies.get('csrftoken');
          }
          return config;
        },*/
        responseError: function(rejection) {
          if (rejection.config.url.search('/api/admin/user') !== -1){
            return rejection;
          }
          if (rejection.status === 401){
            $location.url('/login');
          }
          return $q.reject(rejection);
        }
      }
   })
  .config(['$httpProvider',function($httpProvider) {
      $httpProvider.interceptors.push('httpInterceptor');
   }]);



