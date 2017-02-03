/**
 * Created by sergey on 03.02.17.
 */

'use strict';

angular.module('angularApp').factory('utils', function () {
  return {
    toDateTime: function (ObjId) {
      var ObjDate;
      ObjDate = new Date(parseInt(ObjId.toString().slice(0,8), 16)*1000);
      return ObjDate.toLocaleDateString() + ' ' + ObjDate.toLocaleTimeString();
    }
  }})

