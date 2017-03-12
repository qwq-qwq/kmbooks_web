/**
 * Created by sergey on 10.03.17.
 */
angular.module('angularApp').factory('confirmDialog', function ($mdPanel, utils) {
  function showConfirm() {
    var position = $mdPanel.newPanelPosition()
      .absolute()
      .center();

    var config = {
      attachTo: angular.element(document.body),
      controller: PanelDialogCtrl,
      controllerAs: 'ctrl',
      disableParentScroll: false,
      templateUrl: 'views/regisration_confirm_dialog.html',
      hasBackdrop: true,
      panelClass: 'demo-dialog-example',
      position: position,
      trapFocus: true,
      zIndex: 1100,
      clickOutsideToClose: true,
      escapeToClose: true,
      focusOnOpen: true
    };
    $mdPanel.open(config);
  };

  PanelDialogCtrl.$inject = ['mdPanelRef', 'utils'];

  function PanelDialogCtrl(a, b) {
    this.mdMyPanelRef = a;
    this.utils = b;
  }

  PanelDialogCtrl.prototype.getMessage = function() {
     return this.utils.GetConfirmDialogMessage();
  }

  PanelDialogCtrl.prototype.closeDialog = function() {
    var panelRef = this.mdMyPanelRef;
    panelRef && panelRef.close().then(function() {
      panelRef.destroy();
    });
  };

  return {
    ShowRegistrationConfirm: function (message) {
      utils.SetConfirmDialogMessage(message);
      return showConfirm();
    }
  }
})
