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
         //scope.lineThroughStyle = {'width': '40%'};
      }else{
         scope.lineThroughStyle = {'margin-left': 'auto', 'margin-right': 'auto', 'max-width': '110px'};
      }
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
            scope.book.priceWithoutDiscount = Math.round(scope.book.price * 100 / (100 - discount) * 10) / 10;
            scope.book.discount = discount;
          }else{
            if (scope.book.priceWithoutDiscount === undefined) {
              scope.book.priceWithoutDiscount = scope.book.price;
            }
            if (discount > 0 && !scope.book.discountForbidden) {
              scope.book.discount = discount;
              scope.book.price = Math.round(scope.book.priceWithoutDiscount * (1 - discount / 100) * 10) / 10;
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
