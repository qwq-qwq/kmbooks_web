'use strict';

angular.module('angularApp').factory('config', function () {

    return {
        url: function() {
        var url = 'https://api.kmbooks.com.ua'; //'https://api.kmbooks.com.ua'; 'http://127.0.0.1:8080'
        return url;
        },
        interDeliveryID: function() {
        var id = '8d5a980d-391c-11dd-90d9-0000000001';
        return id;
        }
    }
  });
