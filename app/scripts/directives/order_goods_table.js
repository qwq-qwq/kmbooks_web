/**
 * Created by sergey on 03.02.17.
 */
'use strict';

angular.module('angularApp').directive('bkOrderGoodsTable', ['$http', 'config', 'authorization', '$location', function($http, config, authorization, $location) {
  return {
    restrict: 'E',
    scope: {
      goodsTable: '='
    },
    templateUrl: 'views/bk_order_goods_table.html',
    link: function(scope, element, attributes) {
      scope.$watch('goodsTable', function () {
        scope.proceedSearch = true;
      })
    }
  };
}])
