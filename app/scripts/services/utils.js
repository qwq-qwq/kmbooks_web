/**
 * Created by sergey on 03.02.17.
 */

'use strict';

angular.module('angularApp').factory('utils', function ($http, $rootScope, config) {
  return {
    toDateTime: function (ObjId) {
      var ObjDate;
      ObjDate = new Date(parseInt(ObjId.toString().slice(0,8), 16)*1000);
      return ObjDate.toLocaleDateString() + ' ' + ObjDate.toLocaleTimeString();
    },
    GetRandomColorSchemes: function () {
      if ($rootScope.newsColorSchemes === undefined) {
        $http.get(config.url() + "/api/news/get_news_color_schemes")
          .success(function (response) {
            $rootScope.newsColorSchemes = response;
          })
      };
    },
    GetRandomColorSchema: function () {
      if ($rootScope.newsColorSchemes !== undefined){
        return $rootScope.newsColorSchemes[Math.floor(Math.random()*$rootScope.newsColorSchemes.length)];
      };
    }
  }})

