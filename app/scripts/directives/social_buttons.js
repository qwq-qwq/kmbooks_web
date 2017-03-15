/**
 * Created by sergey on 14.03.17.
 */

'use strict';

angular.module('angularApp').directive('bkSocialButtons', [function() {
  return {
    restrict: 'E',
    templateUrl: 'views/bk_social_buttons.html'
  };
}])
