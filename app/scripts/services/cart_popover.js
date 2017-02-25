/**
 * Created by sergey on 24.02.17.
 */

'use strict';

angular.module('angularApp').factory('cartPopover', function ($http, $rootScope, config, authorization, $mdPanel) {
  return {
    ShowCart: function () {
        var position = $mdPanel.newPanelPosition().relativeTo('#cart').addPanelPosition("align-start", "below").withOffsetX("-90px").withOffsetY("5px");
        var animation = $mdPanel.newPanelAnimation().openFrom('#cart').closeTo('#cart').withAnimation($mdPanel.animation.FADE);
        var config = {
          attachTo: angular.element(document.body),
          controller: PanelDialogCtrl,
          controllerAs: 'ctrl',
          disableParentScroll: this.disableParentScroll,
          templateUrl: 'views/cart_popover.html',
          hasBackdrop: true,
          panelClass: 'demo-dialog-example',
          position: position,
          animation: animation,
          trapFocus: true,
          zIndex: 1100,
          clickOutsideToClose: true,
          escapeToClose: true,
          focusOnOpen: true
        };

        $mdPanel.open(config);

        PanelDialogCtrl.$inject = ['mdPanelRef', 'cart'];

        function PanelDialogCtrl(a, b) {
          this.mdMyPanelRef = a;
          this.cart = b.GetCart();
        }

        PanelDialogCtrl.prototype.closeDialog = function() {
          var panelRef = this.mdMyPanelRef;
          panelRef && panelRef.close().then(function() {
            panelRef.destroy();
          });
        }

    }}

});
