/**
 * Created by sergey on 16.03.17.
 */

'use strict';

angular.module('angularApp').factory('urlBeforeWrongAuth', function () {
  var urlBeforeWrongAuth = '';
  return {
    GetUrlBeforeWrongAuth: function () {
      return urlBeforeWrongAuth;
    },
    SetUrlBeforeWrongAuth: function (newUrlBeforeWrongAuth) {
      urlBeforeWrongAuth = newUrlBeforeWrongAuth;
    }
  }
})
