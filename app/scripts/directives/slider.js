'use strict';

angular.module('angularApp').directive('bkAfterSlider', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    link: function(scope, element, attributes) {
      scope.$on('sliderloaded', function () {
        $timeout(function () {
          $('#ex1').bootstrapSlider({});
          scope.priceFrom = $('#ex1').bootstrapSlider('getValue')[0];
          scope.priceTo = $('#ex1').bootstrapSlider('getValue')[1];
        });
      })
      element.on('mousedown', function(event) {
        scope.priceFrom = $('#ex1').bootstrapSlider('getValue')[0];
        scope.priceTo = $('#ex1').bootstrapSlider('getValue')[1];
        scope.$apply();
      });
      element.on('mouseup', function(event) {
        scope.priceFrom = $('#ex1').bootstrapSlider('getValue')[0];
        scope.priceTo = $('#ex1').bootstrapSlider('getValue')[1];
        scope.$apply();
      });
    }
  };
}])
