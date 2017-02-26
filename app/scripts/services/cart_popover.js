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

        PanelDialogCtrl.$inject = ['mdPanelRef', 'cart', '$http', 'config', 'authorization'];

        function PanelDialogCtrl(a, b, c, d, e) {
          this.mdMyPanelRef = a;
          this.cartRef = b;
          this.httpRef = c;
          this.configRef = d;
          this.authorizationRef = e;
        }

        PanelDialogCtrl.prototype.closeDialog = function() {
          var panelRef = this.mdMyPanelRef;
          panelRef && panelRef.close().then(function() {
            panelRef.destroy();
          });
        }

        PanelDialogCtrl.prototype.removeFromCart = function(code) {
          var cartRef = this.cartRef;
          cartRef.RemoveFromCart(code);
          if (this.authorizationRef.isAuthorized()) {
            this.httpRef.post(this.configRef.url() + "/api/user/carts/update", cartRef.GetCart(), {withCredentials: true})
              .success(function(response) {
                cartRef.SetCart(response);
              })
          }else{
            this.httpRef.post(this.configRef.url() + "/api/carts/update", cartRef.GetCart())
              .success(function(response) {
                cartRef.SetCart(response);
              })
          }
        }

    }}

});
