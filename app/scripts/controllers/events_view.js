'use strict';

angular.module('angularApp')
  .controller('EventsViewCtrl', function($scope, $http, config, $compile, $timeout, uiCalendarConfig) {

    $scope.eventRender = function( event, element, view){
      element.attr({'uib-tooltip-html': "\'<div>" + event.title + "</div> <img class=\"img-responsive\" src=\""
                   + event.image + "\"> <div><span class=\"glyphicon glyphicon-map-marker\"></span>&nbsp;" + event.where + "</div>\'",
                   'tooltip-append-to-body': true}); $compile(element)($scope);
    };

    $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: false,
        header:{
          left: 'month  agendaWeek',
          center: 'title',
          right: 'today prev,next'
        },
        dayNames: ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"],
        dayNamesShort: ["НД", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"],
        monthNames: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"],
        monthNamesShort: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"],
        allDayText: ['весь-день'],
        slotLabelFormat: 'H:mm',
        firstDay: 1,
        buttonText: {
          today: "Сьогодні",
          day: "День",
          week: "Тиждень",
          month: "Місяць"
        },
        timeFormat: 'H:mm',
        eventRender: $scope.eventRender
      }
    };

    $scope.eventSources = [];

    function compare_desc(a,b) {
      if (a.when > b.when)
        return -1;
      else if (a.when < b.when)
        return 1;
      else
        return 0;
    }

    $http.get(config.url() + "/api/events")
      .success(function(response) {
        $scope.events = response;
        var cards = [];
        $scope.cards = cards;
        var firstTile = true;
        var today = new Date();
        var oldEvents = [];
        var newEvents = [];
        var Events =[];
        for (var key in response) {
          var dateComp = new Date(response[key].when);
          if (dateComp >= today) {
            newEvents.push(response[key]);
          }else{
            oldEvents.push(response[key]);
          }
        }
        angular.forEach(newEvents, function(row) {
          Events.push(row);
        });
        oldEvents.sort(compare_desc);
        angular.forEach(oldEvents, function(row) {
          Events.push(row);
        });
        angular.forEach(Events, function(row) {
          var html = row.text;
          var div = document.createElement("div");
          div.innerHTML = html;
          var text = div.textContent || div.innerText || "";
          if (firstTile === true) {
            $scope.cards.push({
              template: "views/big_event_item.html",
              data: row,
              textShort: text.substring(0, 300) + '...',
              bigImage: row.image.replace('/img/', '/img/big_')
            });
            firstTile = false
          }else{
            $scope.cards.push({
              template: "views/event_item.html",
              data: row,
              textShort: text.substring(0, 250) + '...'
            });
          }
        });
        $scope.calendarEvents = [];
        for (var key in response) {
           var dateEventStart = new Date(response[key].when);
           if (response[key].end === undefined) {
             var dateEventEnd = new Date(response[key].when);
             dateEventEnd.setHours(dateEventStart.getHours() + 2);
           }else{
             var dateEventEnd = new Date(response[key].end);
           };
           $scope.calendarEvents.push({title: response[key].title, start: dateEventStart, end: dateEventEnd, allDay: false,
             url: '#/event_view?id=' + response[key].id, image: response[key].image, where: response[key].where});
        }

        uiCalendarConfig.calendars.calendar.fullCalendar('removeEvents');
        uiCalendarConfig.calendars.calendar.fullCalendar('addEventSource', $scope.calendarEvents);

      })

    $scope.deleteCard = function(id){
      var index = -1;
      for(var k in $scope.cards){
        if($scope.cards[k].data.id == id){
          index = k;
          break;
        }
      }
      if(index !== -1){
        $scope.cards.splice(index, 1);
      }
    }

  })
  .controller('Work1Controller', ['$scope', '$rootScope', '$timeout',
    function($scope, $rootScope, $timeout) {
      $scope.showingMoreText = false;

      $scope.animateElementIn = function($el) {
        $el.removeClass('not-visible');
        $el.addClass('animated pulse'); // this example leverages animate.css classes
      };

      $scope.animateElementOut = function($el) {
        $el.addClass('not-visible');
        $el.removeClass('animated pulse'); // this example leverages animate.css classes
      };

      $scope.toggleText = function(){
        $scope.showingMoreText = !$scope.showingMoreText;
        // We need to broacast the layout on the next digest once the text
        // is actually shown
        // TODO: for some reason 2 a $timeout is here necessary
        $timeout(function(){
          $rootScope.$broadcast("layout", function(){
            // The layout animations have completed
          });
        }, 2);
      }
    }]);;
