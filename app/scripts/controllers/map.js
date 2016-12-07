'use strict';

angular.module('angularApp')
  .controller('MapCtrl', function ($scope, $http, $location, $anchorScroll, config) {
    var code_shop = $location.search().code_shop;

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

    $scope.initialize = function initialize() {
      var styles = [
        {
          stylers: [
            { hue: "#00ffe6" },
            { saturation: -90 }
          ]
        },
        /*{
          featureType: "road",
          elementType: "geometry",
          stylers: [
            { lightness: 100 },
            { visibility: "simplified" }
          ]
        },{
          featureType: "road",
          elementType: "labels",
          stylers: [
            { visibility: "off" }
          ]
        }*/
      ];

      var styledMap = new google.maps.StyledMapType(styles, {name: "Styled Map"});

      var mapOptions = {
        zoom: 6,
        center: new google.maps.LatLng(49.210, 31.100),
        //mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControlOptions: {
          mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
        }
      };
      $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      $scope.map.mapTypes.set('map_style', styledMap);
      $scope.map.setMapTypeId('map_style');

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
              title: $scope.gmap[k].name,
              icon: 'img/K.png'
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
          }
          for (var k in $scope.gmap) {
            if ($scope.gmap[k].sprut_code == code_shop) {
              $scope.goToMarker($scope.gmap[k]);
              break;
            }
          }
        })
    }
})
