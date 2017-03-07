/**
 * Created by sergey on 07.03.17.
 */

'use strict';

angular.module('angularApp').factory('wfpListener', function ($http, $rootScope, $window) {
    function listener() {
      $window.addEventListener("message", function receiveMessage(event) {
        if (
          event.data == "WfpWidgetEventClose" ||      //при закрытии виджета пользователем
          event.data == "WfpWidgetEventApproved" ||   //при успешном завершении операции
          event.data == "WfpWidgetEventDeclined" ||   //при неуспешном завершении
          event.data == "WfpWidgetEventPending")      // транзакция на обработке
        {
          $rootScope.$broadcast('wfp_window_events', event);
        }
      })
    }
    return{
      "subscribeMe": listener()
    }

})


