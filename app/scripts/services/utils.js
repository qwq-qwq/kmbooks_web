/**
 * Created by sergey on 03.02.17.
 */

'use strict';

angular.module('angularApp').factory('utils', function ($http, $rootScope, config) {
  var confirmDialogMessage;
  return {
    toDateTime: function (ObjId) {
      var ObjDate;
      ObjDate = new Date(parseInt(ObjId.toString().slice(0,8), 16)*1000);
      return ObjDate.toLocaleDateString() + ' ' + ObjDate.toLocaleTimeString();
    },
    toUnixTime: function (ObjId) {
      return parseInt(ObjId.toString().slice(0,8), 16);
    },
    fromUnixTime: function (UnixTime) {
      var ObjDate = new Date(UnixTime);
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
    },
    GetRandomNumber: function () {
       return Math.floor((Math.random()*10000)+1)+10;
    },
    GetConfirmDialogMessage: function () {
      return confirmDialogMessage
    },
    SetConfirmDialogMessage: function (message) {
      confirmDialogMessage = message;
    }
  }})

