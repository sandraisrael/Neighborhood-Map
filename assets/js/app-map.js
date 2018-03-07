var map;
// array for markers
var markers = [];
var marker;
var infoWindow;
var largeInfowindow;



function initMap() {
  // Constructor creates a new map
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 25.199514, lng: 55.277397 },
    zoom: 15,
  });

  largeInfowindow = new google.maps.InfoWindow({
    maxWidth: 200
  });
  var bounds = new google.maps.LatLngBounds();

  // places array in app.js to create an array of markers on initialize.
  for (var i = 0; i < places.length; i++) {
    // Get the position from the places array.
    initiateMarker(places[i]);
    bounds.extend(markers[i].position);
  }

  function initiateMarker() {
    var position = places[i].location;
    var title = places[i].title;

    var defaultIcon = makeMarkerIcon('564787');
    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('DBCBD8');

    // Create a marker per location
    marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      id: i,
      icon: defaultIcon,
    });

    // Push the marker to our array of markers.
    markers.push(marker);
    places[i].marker = marker;

    // Create an onclick event to open an infowindow for each marker.
    marker.addListener('click', function () {
      populateInfoWindow(this, largeInfowindow);
      
      var self = this
      this.setAnimation(google.maps.Animation.BOUNCE);
      window.setTimeout(function (marker) {
        self.setAnimation(null);
      }, 800);
    });

    // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
    marker.addListener('mouseover', function () {
      this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function () {
      this.setIcon(defaultIcon);
    });
  }

  // Extend the boundaries of the map for each marker
  map.fitBounds(bounds);
}


// Show info window for all markers
function populateInfoWindow(marker, infowindow) {
  var apiresult
  // Check to make sure the infowindow is not already opened on this marker.
  $.ajax({
    url: 'https://en.wikipedia.org/w/api.php',
    data: {
      format: "json",
      action: "query",
      list: "search",
      srsearch: marker.title,
      formatversion: 2
    }, dataType: 'jsonp',
    headers: {
      'Api-User-Agent': 'MyCoolTool/1.1 (http://example.com/MyCoolTool/; MyCoolTool@example.com) BasedOnSuperLib/1.4'
    },
  }).done(function (data) {
    apiresult = data.query.search["0"].snippet;
  }).fail(function (err) {
    alert("Failed to Load data from wikipedia api")
  }).then(function () {

    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent('<div> <h1>' + marker.title + '</h1>' + apiresult + '</div>');
      infowindow.open(map, marker);

      infowindow.addListener('closeclick', function () {
        infowindow.setMarker = null;
      });
    }
  })
}

// / This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21, 34));
  return markerImage;
}

function myerrorhandler() {
  alert("Hi! There's a problem loading Google Maps API");
}
