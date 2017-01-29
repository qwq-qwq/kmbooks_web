/**
 * Created by Desster on 17.12.2015.
 */
'use strict';

angular.module('angularApp')
  .controller('MapEditTableCtrl', function($scope, $http, $location, $anchorScroll, $route, config) {

    $http.get(config.url() + "/api/get_cities")
      .success(function(response) {
        $scope.cities = response;
        $scope.selector = {};
        $scope.selector.city = $scope.cities[0];
        //$scope.SelectCity();
      })

    $scope.goToMarker = function goToMarker(gmap) {
      $scope.map.setCenter(new google.maps.LatLng(gmap.lat, gmap.longit));
      $scope.map.setZoom(15);
      var html = '<b>' + gmap.name + '</b><br>' + gmap.description.replace(/\/"/g, "\"");
      $scope.infoWindow.setOptions({
        content: html,
        position: new google.maps.LatLng(gmap.lat, gmap.longit),
        pixelOffset: new google.maps.Size(0, -37)
      });
      $scope.infoWindow.open($scope.map);
      $anchorScroll();
    }

    $scope.editItem = function (item) {
      item.editing = true;
      angular.forEach($scope.cities, function (city, key) {
         if(item.city === city.originalId){
           item.controlCity = $scope.cities[key];
         }
      })
    }

    $scope.doneEditing = function (item) {
      item.editing = false;
      var gmap = {id: item.id, name: item.name, description: item.description, sprut_code: item.sprut_code,
                  sortIndex: item.sortIndex, lat: item.lat, longit: item.longit, city: item.city};
      $http.post(config.url() + "/api/edit/gmap_update", gmap, {withCredentials: true})
        .success(function(response) {
            if (typeof item.upl_item != 'undefined'){
                item.upl_item.upload();
            }
            if (gmap.id == 0) {
              $route.reload();
            }
        });
    }
    $scope.AddItem = function () {
      var gmp = {id: 0, name: '', description: '', sprut_code: 0, sortIndex: 0, lat: '50.4508', longit: '30.5276', editing: true};
      $scope.gmap.push(gmp);
    }
    $scope.deleteItem = function (item) {
      $http.post(config.url() + "/api/edit/gmap_delete", item, {withCredentials: true})
        .success(function(response) {
          for (var k in $scope.gmap) {
            if ($scope.gmap[k].id == item.id) {
              $scope.gmap.splice(k, 1);
              break;
            }
          }
      })
    }

    $scope.initialize = function initialize() {
      var mapOptions = {
        zoom: 6,
        center: new google.maps.LatLng(48.210, 31.100),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      $scope.bounds = new google.maps.LatLngBounds();
      $scope.infoWindow = new google.maps.InfoWindow({
        maxWidth: 500
      });
      $http.get(config.url() + "/api/gmaps")
        .success(function (response) {
          $scope.gmap = response;
          for (var k in $scope.gmap) {
            var lat = $scope.gmap[k].lat.replace(/"/g, "");
            var lng = $scope.gmap[k].longit.replace(/"/g, "");
            var myLatlng = new google.maps.LatLng(lat, lng);
            $scope.bounds.extend(myLatlng);
            var marker = new google.maps.Marker({
              position: myLatlng,
              map: $scope.map,
              draggable: true,
              db_id: $scope.gmap[k].id,
              title: $scope.gmap[k].name
            });

            var html = '<b>' + $scope.gmap[k].name + '</b><br>' + $scope.gmap[k].description.replace(/\/"/g, "\"");
            google.maps.event.addListener(marker, 'click', (function (html, marker_new) {
              return function () {
                $scope.infoWindow.setOptions({
                  content: html,
                  pixelOffset: 0
                });
                $scope.infoWindow.setContent(html);
                $scope.infoWindow.open($scope.map, marker_new);
              }
            }(html, marker)));

            google.maps.event.addListener(marker, 'position_changed', (function (marker_new) {
              return function () {
                $scope.$apply(function () {
                  {
                    for (var k in $scope.gmap) {
                      if ($scope.gmap[k].id == marker_new.db_id) {
                        $scope.gmap[k].lat = marker_new.position.lat();
                        $scope.gmap[k].longit = marker_new.position.lng();
                        break;
                      }
                    }
                  }
                })
              }
            }(marker)));
          }
        })
    }

});
