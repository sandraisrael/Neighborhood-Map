var map;
function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 25.199514, lng: 55.277397 },
    zoom: 15,
  });

  // array for markers.
  var markers = [];
  var largeInfowindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();

  // use places array in app.js to create an array of markers on initialize.
  for (var i = 0; i < places.length; i++) {
    // Get the position from the places array.
    var position = places[i].location;
    var title = places[i].title;


    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      id: i
    });
    // Push the marker to our array of markers.
    markers.push(marker);
    console.log(marker.title)

    // Create an onclick event to open an infowindow for each marker.
    marker.addListener('click', function () {
      populateInfoWindow(this, largeInfowindow);
    });
    bounds.extend(markers[i].position);
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
    console.log(data.query.search["0"].snippet);
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

