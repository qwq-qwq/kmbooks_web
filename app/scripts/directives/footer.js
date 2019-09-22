/**
 * Created by sergey on 04.04.17.
 */

'use strict';

angular.module('angularApp').directive('bkFooter', ['$timeout', '$interval', '$document', '$rootScope', '$window', 'subscribeDialog', 'callbackDialog',
                                                    function($timeout, $interval, $document, $rootScope, $window, subscribeDialog, callbackDialog) {
  return {
    restrict: 'E',
    templateUrl: 'views/bk_footer.html',
    link: function(scope, element, attributes) {
      $rootScope.$on("$routeChangeSuccess", function (event, next, current) {
        if ((next.$$route.originalPath === '/') ||
            (next.$$route.originalPath === '/events') ){
          scope.footerEventCardsTopCalculator();
        }else{
          scope.footerStyle={display: 'block', position: 'absolute', bottom: 0};
        }
      })

      /*angular.element($window).bind('resize', function(){
        var pageHeight = $document.height();
        var footerTop = pageHeight + 10;
        scope.footerStyle={top: footerTop, position: 'absolute', width: '100%'};
        scope.$digest();
      });*/

      $rootScope.$on('change_event_cards', function () {
        scope.footerEventCardsTopCalculator();
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

      scope.footerEventCardsTopCalculator = function () {
        var elements = $document[0].querySelectorAll(
          '.dynamic-layout-item-parent:not(.ng-leave)'
        );
        var maxItemBottom = 0;
        for (var i = 0; i < elements.length; ++i) {
          // Note: we need to get the children element width because that's
          // where the style is applied
          var rect = elements[i].children[0].getBoundingClientRect();
          var width;
          var height;
          if (rect.width) {
            width = rect.width;
            height = rect.height;
          } else {
            width = rect.right - rect.left;
            height = rect.top - rect.bottom;
          }

          var itemBottom = elements[i].offsetTop + height +
            parseFloat($window.getComputedStyle(elements[i]).marginTop);
          if (itemBottom > maxItemBottom){
            maxItemBottom = itemBottom;
          }

        }
        var eventContainer = $document[0].querySelector(
          '.events-container'
        );
        if (eventContainer === null){
           return;
        }
        var evContHeight = eventContainer.offsetTop;
        var top = evContHeight + maxItemBottom;
        var footerTop = top + 10;
        scope.footerStyle={display: 'block', top: footerTop, position: 'absolute', width: '100%'};
      }
    }
  };
}])
