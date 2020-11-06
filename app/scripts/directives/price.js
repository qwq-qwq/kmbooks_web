/**
 * Created by sergey on 07.03.17.
 */
'use strict';

angular.module('angularApp').directive('bkPrice', ['authorization', '$rootScope', function(authorization, $rootScope) {
  return {
    restrict: 'E',
    templateUrl: 'views/bk_price.html',
    scope: {
      book: '='
    },
    link: function(scope, element, attributes) {
      scope.updateAuthorization = function () {
        var discount = 0;
        if (authorization.isAuthorized()) {
          if (authorization.getUser().valueOfPurchases <= 1000){
            discount = 3;
          }else{
            discount = 5;
          }
        }
        if (scope.book !== undefined){
          if (scope.book.actionKM !== null) {
            discount = parseInt(scope.book.actionKM);
//            scope.book.priceWithoutDiscount = Math.round(scope.book.price * 100 / (100 - discoun0t) * 10) / 10;
            scope.book.priceWithoutDiscount = Math.round(scope.book.price * 100 / (100 - discount));      
            scope.book.discount = 0;
          }else{
            if (scope.book.priceWithoutDiscount === undefined) {
              scope.book.priceWithoutDiscount = scope.book.price;
            }
            if (discount > 0 && !scope.book.discountForbidden) {
              scope.book.discount = discount;
//              scope.book.price = Math.round(scope.book.priceWithoutDiscount * (1 - discount / 100) * 10) / 10;
              scope.book.price = Math.round(scope.book.priceWithoutDiscount * (1 - discount / 100)) ;              
            } else {
              scope.book.discount = 0;
              scope.book.price = scope.book.priceWithoutDiscount;
            }
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
