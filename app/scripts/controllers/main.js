'use strict';

angular.module('angularApp')
  .controller('MainCtrl', function($scope, $http, config, $q, $timeout, $rootScope, utils) {
    // function compare_desc(a,b) {
    //   if (a.when > b.when)
    //     return -1;
    //   else if (a.when < b.when)
    //     return 1;
    //   else
    //     return 0;
    // }

    // function loadingEvents() {
    //   $http.get(config.url() + "/api/events")
    //     .success(function (response) {
    //       $scope.events = response;
    //       var cards = [];
    //       $scope.cards = cards;
    //       var firstTile = true;
    //       var today = new Date();
    //       var oldEvents = [];
    //       var newEvents = [];
    //       var Events = [];
    //       for (var key in response) {
    //         var dateComp = new Date(response[key].when);
    //         if (dateComp >= today) {
    //           newEvents.push(response[key]);
    //         } else {
    //           oldEvents.push(response[key]);
    //         }
    //       }
    //       angular.forEach(newEvents, function (row) {
    //         Events.push(row);
    //       });
    //       oldEvents.sort(compare_desc);
    //       angular.forEach(oldEvents, function (row) {
    //         Events.push(row);
    //       });
    //       angular.forEach(Events, function (row) {
    //         var html = row.text;
    //         var div = document.createElement("div");
    //         div.innerHTML = html;
    //         var text = div.textContent || div.innerText || "";
    //         if (firstTile === true) {
    //           $scope.cards.push({
    //             template: "views/big_event_item.html",
    //             data: row,
    //             textShort: text.substring(0, 300) + '...',
    //             bigImage: row.image.replace('/img/', '/img/big_')
    //           });
    //           firstTile = false
    //           $scope.cards.push({
    //             template: "views/partners.html",
    //             data: {id: '11111111111111111'}
    //           });
    //           $scope.cards.push({
    //             template: "views/soc_net.html",
    //             data: {id: '222222222222222'}
    //           });
    //         } else {
    //           $scope.cards.push({
    //             template: "views/event_item.html",
    //             data: row,
    //             textShort: text.substring(0, 250) + '...'
    //           });
    //         }
    //       });
    //     })
    // }

    $http.get(config.url() + "/api/news/get_last_nine")
      .success(function(response) {
        $scope.news = response;
      })


    function loadingNovelty() {
      $http.get(config.url() + "/api/books/novelty")
        .success(function(response) {
          $scope.noveltys = response;
        })
    }

    //function loadingBest() {
    //  $http.get(config.url() + "/api/books/best_of_week")
    //    .success(function (response) {
    //      $scope.bestsellers = response;
    //    })
    //}

    function loadingBest() {
      $http.get(config.url() + "/api/books/custom_top?limit=4")
        .success(function(response) {
          $scope.bestsellers = response.bookList;
        })
    }

    function loadingRecomended() {
      $http.get(config.url() + "/api/books/recommended?limit=4")
        .success(function(response) {
          $scope.recommendeds = response.bookList;
        })
    }

    function loadingSoonOnSale() {
      $http.get(config.url() + "/api/books/soon_on_sale?limit=4")
        .success(function(response) {
          $scope.soonOnSales = response.bookList;
        })
    }

    function loadingLastComments() {
      $http.get(config.url() + "/api/comments/last?limit=3")
        .success(function(response) {
          $scope.comments = response;
        })
    }

    $q.all([loadingRecomended(), loadingBest(), loadingNovelty(), loadingSoonOnSale(), loadingLastComments()])
      .then(function () {
      // $timeout(function(){
      //    $rootScope.$broadcast("layout", function () {
      //      $rootScope.$broadcast('change_event_cards');
      //    });
      // }, 2000);
    });

    $scope.toDateTime = function(ObjId) {
      return utils.toDateTime(ObjId);
    }

    $scope.getCommentText = function (text) {
      var suffix = text.length > 300 ? '...' : '';
      return "\"" + text.substring(0, 300) + suffix + "\"";
    }

    $scope.properties = {
      items: 1,
      onChange: function () {
        console.dir(arguments);
      }
    };

    // $scope.deleteCard = function(id){
    //   var index = -1;
    //   for(var k in $scope.cards){
    //     if($scope.cards[k].data.id == id){
    //       index = k;
    //       break;
    //     }
    //   }
    //   if(index !== -1){
    //     $scope.cards.splice(index, 1);
    //   }
    // }

  });
