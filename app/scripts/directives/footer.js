/**
 * Created by sergey on 04.04.17.
 */

'use strict';

angular.module('angularApp').directive('bkFooter', ['$timeout', '$document', '$rootScope', 'subscribeDialog', 'callbackDialog',
                                                    function($timeout, $document, $rootScope, subscribeDialog, callbackDialog) {
  return {
    restrict: 'E',
    templateUrl: 'views/bk_footer.html',
    link: function(scope, element, attributes) {
      $rootScope.$on("$routeChangeSuccess", function (event, next, current) {
        if ((next.$$route.originalPath === '/') ||
          (next.$$route.originalPath === '/search') ||
          (next.$$route.originalPath === '/events')){
          scope.footerStyle={display: 'none'};
        }else if((next.$$route.originalPath === '/login') ||
                 (next.$$route.originalPath === '/user_registration') ||
                 (next.$$route.originalPath === '/user_update_password')){
          scope.footerTopCalculator();
        }else if((next.$$route.originalPath === '/book') ||
                 (next.$$route.originalPath === '/wish_list') ||
                 (next.$$route.originalPath === '/my_orders')){
          scope.footerStyle={display: 'none'};
          $timeout(function () {
            scope.footerTopCalculator();
          }, 1500);
        }else{
          scope.footerStyle={};
        }
      })

      scope.ShowSubscribeDialog = function () {
        subscribeDialog.Show();
      }

      scope.ShowCallbackDialog = function () {
        callbackDialog.Show();
      }

      scope.footerTopCalculator = function () {
        var pageHeight = $document.height();
        var footerTop = pageHeight + 10;
        scope.footerStyle={top: footerTop, position: 'absolute', width: '100%'};
      }
    }
  };
}])
