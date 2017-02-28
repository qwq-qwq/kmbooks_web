/**
 * Created by sergey on 28.02.17.
 */

'use strict';

angular.module('angularApp')
  .controller('PageTitleCtrl', function($scope, pageTitle, $rootScope) {

     $rootScope.$on('title_has_updated', function () {
       $scope.title = pageTitle.GetTitle();
     })

     $rootScope.$on('description_has_updated', function () {
       $scope.description = pageTitle.GetDescription();
     })

     $rootScope.$on("$routeChangeSuccess", function (event, next, current) {
         if ((next.$$route.originalPath !== '/book') &&
             (next.$$route.originalPath !== '/news')){
           var title = 'Книжковий інтернет - магазин, купити книги в онлайн магазині Україна, Київ';
           var description = 'Великий вибір книг всіх жанрів в інтернет-магазині kmbooks.com.ua. Замовте книги з доставкою кур\'єром, або поштою по Києву та Україні';
           pageTitle.SetTitle(title);
           pageTitle.SetDescription(description);
         }
     });
  })
