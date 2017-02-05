'use strict';

angular.module('angularApp').directive('bkBookTail', ['wishList', '$mdPanel', '$http', 'config', 'authorization',
  function(wishList, $mdPanel, $http, config, authorization) {
  return {
    restrict: 'E',
    scope: {
      book: '='
    },
    templateUrl: 'views/bk_book_tail.html',
    link: function(scope, element, attributes) {
      scope.alreadyInWishList = false;
      scope.wishHeart = 'fa fa-heart-o brand-color';

      scope.onMouseLeave = function () {
        if (!scope.alreadyInWishList) {
          scope.wishHeart = 'fa fa-heart-o brand-color';
        }else{
          scope.wishHeart = 'fa fa-heart brand-color-hover';
        }
      }
      scope.onMouseEnter = function () {
        scope.wishHeart = 'fa fa-heart brand-color-hover';
      }

      scope.$on('wish_list_has_added', function () {
        if (scope.book !== undefined) {
          if (wishList.AlreadyInWishList(scope.book.code)) {
            scope.alreadyInWishList = true;
            scope.wishHeart = 'fa fa-heart brand-color-hover';
          }
        }
      })

      scope.AddToWishList = function (book) {
        if (authorization.isAuthorized()) {
          var wishListItem = {username: authorization.username(), code: book.code, name: book.name};
          $http.post(config.url() + "/api/user/wish_lists/update", wishListItem, {withCredentials: true})
            .success(function (response) {
                wishList.SetWishList(response);
            })
        }else{
          scope.showConfirm();
        }
      }
      scope.showConfirm = function() {

        var position = $mdPanel.newPanelPosition()
          .absolute()
          .center();

        var config = {
          attachTo: angular.element(document.body),
          controller: PanelDialogCtrl,
          controllerAs: 'ctrl',
          disableParentScroll: this.disableParentScroll,
          templateUrl: 'views/confirm_dialog.html',
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

      function PanelDialogCtrl(mdPanelRef) {
        this.mdMyPanelRef = mdPanelRef;
      }

      PanelDialogCtrl.prototype.closeDialog = function() {
        var panelRef = this.mdMyPanelRef;
        panelRef && panelRef.close().then(function() {
          panelRef.destroy();
        });
      };
    }
  };
}])
