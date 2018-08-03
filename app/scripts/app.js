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
    'ui.bootstrap-slider',
    'ngJcrop',
    'ngMaterial',
    'ui.mask',
    'angular-loading-bar'
  ])
  .config(function ($routeProvider, $locationProvider, $mdDateLocaleProvider) {

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
      .when('/book', {
        templateUrl: 'views/book_view.html',
        controller: 'BookViewCtrl',
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
        controller: 'BooksTableCtrl',
        reloadOnSearch: false
      })
      .when('/cart', {
          templateUrl: 'views/cart.html',
          controller: 'CartCtrl'
      })
      .when('/my_orders', {
        templateUrl: 'views/my_orders.html',
        controller: 'MyOrdersCtrl'
      })
      .when('/wish_list', {
        templateUrl: 'views/wish_list.html',
        controller: 'WishListCtrl'
      })
      .when('/news_edit_table', {
        templateUrl: 'views/news_edit_table.html',
        controller: 'NewsEditCtrl'
      })
      .when('/news', {
        templateUrl: 'views/news.html',
        controller: 'NewsCtrl'
      })
      .when('/user_registration', {
        templateUrl: 'views/user_registration.html',
        controller: 'UserRegistrationCtrl'
      })
      .when('/user_update_password', {
        templateUrl: 'views/user_registration.html',
        controller: 'UserRegistrationCtrl'
      })
      .when('/ntml_pages_edit_table', {
        templateUrl: 'views/html_pages_edit_table.html',
        controller: 'HtmlPagesEditCtrl'
      })
      .when('/ntml_page', {
        templateUrl: 'views/html_page_view.html',
        controller: 'HtmlPageCtrl'
      })
      .when('/orders', {
        templateUrl: 'views/orders_view.html',
        controller: 'OrdersCtrl'
      })
      .when('/news_list', {
        templateUrl: 'views/news_list.html',
        controller: 'NewsListCtrl'
      })
      .when('/recommended', {
        templateUrl: 'views/books_table.html',
        controller: 'BooksTableCtrl'
      })
      .when('/soon_on_sale', {
        templateUrl: 'views/books_table.html',
        controller: 'BooksTableCtrl'
      })
      .when('/callbacks', {
        templateUrl: 'views/callbacks.html',
        controller: 'CallbacksCtrl'
      })
      .when('/subscriptions', {
        templateUrl: 'views/subscriptions.html',
        controller: 'SubscriptionsCtrl'
      })
      .when('/comments_edit_table', {
        templateUrl: 'views/comments_edit_table.html',
        controller: 'CommentsEditCtrl'
      })
      .when('/wish_lists_report', {
        templateUrl: 'views/wish_lists_report.html',
        controller: 'WishListsReportCtrl'
      })
      .when('/stipend', {
        redirectTo: function() {
          window.location = "https://kmbooks.com.ua/stipend/";
        }
      })
      .otherwise({
        redirectTo: '/'
      })

      $locationProvider.html5Mode(true);

  })
  .run(function (api) {
     api.init();
    // socialFB.init('199264067223695');
  })
  .factory('httpInterceptor', function($q, $location, urlBeforeWrongAuth){
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
            urlBeforeWrongAuth.SetUrlBeforeWrongAuth(rejection.config.url);
            $location.url('/login');
          }
          return $q.reject(rejection);
        }
      }
   })

  .config(['$httpProvider',function($httpProvider) {
      $httpProvider.interceptors.push('httpInterceptor');
   }])
  .config(function(ngJcropConfigProvider){
    ngJcropConfigProvider.setJcropConfig('uploadBanner', {
    bgColor: 'black',
    bgOpacity: .4,
    aspectRatio: 2.69591528,
    minSize: [100, 100],
    maxHeight: 600,
    maxWidth: 600
    });
    ngJcropConfigProvider.setJcropConfig('uploadNewsPictures', {
      bgColor: 'black',
      bgOpacity: .4,
      aspectRatio: 1.4,
      minSize: [100, 100],
      maxHeight: 600,
      maxWidth: 600
    });
  })
   .config(['$mdThemingProvider', function($mdThemingProvider) {
     $mdThemingProvider.disableTheming();
  }])
   .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
  }])
   .config(['$mdDateLocaleProvider', function($mdDateLocaleProvider) {
    $mdDateLocaleProvider.firstDayOfWeek = 1;
    $mdDateLocaleProvider.months = ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"];
    $mdDateLocaleProvider.shortMonths = ["Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"];
    $mdDateLocaleProvider.days = ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"];
    $mdDateLocaleProvider.shortDays = ["НД", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"];
    $mdDateLocaleProvider.formatDate = function(date) {
      return moment(date).format('DD.MM.YYYY');
    };
  }]);



