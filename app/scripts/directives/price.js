/**
 * Created by sergey on 07.03.17.
 */
'use strict';

angular.module('angularApp').directive('bkPrice', ['authorization', '$rootScope', function(authorization, $rootScope) {
  return {
    restrict: 'E',
    templateUrl: 'views/bk_price.html',
    scope: {
      div: '=',
      book: '='
    },
    link: function(scope, element, attributes) {
      if (scope.div === false){
         scope.lineThroughStyle = {'margin-left': 0};
      }
      scope.updateAuthorization = function () {
        var discount = authorization.isAuthorized() ? 3 : 0;
        if (scope.book !== undefined){
          if (scope.book.priceWithoutDiscount === undefined){
            scope.book.priceWithoutDiscount = scope.book.price;
          }
          if (discount > 0){
            scope.book.discount = discount;
            scope.book.price = Math.round(scope.book.priceWithoutDiscount * (1 - discount/100) * 100) / 100;
          }else{
            scope.book.discount = 0;
            scope.book.price = scope.book.priceWithoutDiscount;
          }
        }
      }
      scope.updateAuthorization();
      $rootScope.$on('successful_authorization', function () {
        scope.updateAuthorization();
      })

      $rootScope.$on('successful_logout', function () {
        scope.updateAuthorization();
      })

      scope.$watch('book', function () {
        scope.updateAuthorization();
      })
    }
  };
}])
