/**
 * Created by sergey on 14.03.17.
 */

'use strict';

angular.module('angularApp').directive('bkSocialButtons', [function() {
  return {
    restrict: 'E',
    scope: {
      kind: '@',
      item: '=',
      absUrl: '='
    },
    templateUrl: 'views/bk_social_buttons.html'
  };
}])
