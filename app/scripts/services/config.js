'use strict';

angular.module('angularApp').factory('config', function () {

    return {
        url: function() {
        var url = 'https://api.kmbooks.com.ua'; //'http://api.kmbooks.com.ua'; 'http://127.0.0.1:8080'
        return url;
      }
    }
  });
