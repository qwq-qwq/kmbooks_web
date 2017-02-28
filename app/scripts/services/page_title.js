/**
 * Created by sergey on 27.02.17.
 */
'use strict';

angular.module('angularApp').factory('pageTitle', function ($http, $rootScope, config) {
  //var title = 'Книжковий інтернет - магазин, купити книги в онлайн магазині Україна, Київ';
  var title = '';
  var description = '';
  function removeHtmlTags(html) {
    var div = document.createElement("div");
    div.innerHTML = html;
    var text = div.textContent || div.innerText || "";
     return text;
  }
  return {
    GetTitle: function () {
      return title;
    },
    SetTitle: function (newTitle) {
      title = removeHtmlTags(newTitle);
      $rootScope.$broadcast('title_has_updated');
    },
    GetDescription: function () {
      return description;
    },
    SetDescription: function (newDescription) {
      description = removeHtmlTags(newDescription);
      $rootScope.$broadcast('description_has_updated');
    }
  }
})
