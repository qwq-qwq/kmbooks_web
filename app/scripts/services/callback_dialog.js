/**
 * Created by sergey on 03.04.17.
 */
'use strict';

angular.module('angularApp').factory('callbackDialog', function ($http, $rootScope, config, authorization, $mdPanel) {
  return {
    Show: function () {
      var position = $mdPanel.newPanelPosition().absolute().center();
      var animation = $mdPanel.newPanelAnimation().openFrom('#cart').closeTo('#cart').withAnimation($mdPanel.animation.FADE);
      var config = {
        attachTo: angular.element(document.body),
        controller: PanelDialogCtrl,
        controllerAs: 'ctrl',
        disableParentScroll: this.disableParentScroll,
        templateUrl: 'views/callback_dialog.html',
        hasBackdrop: true,
        panelClass: 'demo-dialog-example',
        position: position,
        animation: animation,
        trapFocus: true,
        zIndex: 1,
        clickOutsideToClose: true,
        escapeToClose: true,
        focusOnOpen: true
      };

      $mdPanel.open(config);
      PanelDialogCtrl.$inject = ['mdPanelRef', '$http', 'config', '$scope'];

      function PanelDialogCtrl(a, c, d, e) {
        this.mdMyPanelRef = a;
        this.httpRef = c;
        this.configRef = d;
        e.savingInProgress = false;
        e.saved = false;
        this.scope = e;
      }

      PanelDialogCtrl.prototype.closeDialog = function() {
        var panelRef = this.mdMyPanelRef;
        panelRef && panelRef.close().then(function() {
          panelRef.destroy();
        });
      }

      PanelDialogCtrl.prototype.Save = function() {
        var http = this.httpRef;
        var scope = this.scope;
        var panelRef = this.mdMyPanelRef;
        scope.savingInProgress = true;
        var subscription = {name: scope.name, phone: scope.phone}
        http.post(this.configRef.url() + "/api/callbacks/update", subscription)
          .then(function(response) {
            scope.savingInProgress = false;
            panelRef && panelRef.close().then(function() {
              panelRef.destroy();
            });
          })
      }

    }}

});
