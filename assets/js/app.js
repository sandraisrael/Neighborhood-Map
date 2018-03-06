// MODEL FOR DATA OF PLACES IN NEIGHBORHOOD
var places = [
    {
        title: 'Dubai Mall',
        location: {
            lat: 25.1985,
            lng: 55.2796
        },
        description: " ",
        // marker: null
    },
    {
        title: 'Burj Khalifa',
        location: {
            lat: 25.197525,
            lng: 55.274288
        },
        description: " ",
        // marker: null
    },
    {
        title: 'Burj Al Arab',
        location: {
            lat: 25.141050,
            lng: 55.185978
        },
        description: " ",
        // marker: null
    },
    {
        title: 'Atlantis, The Palm',
        location: {
            lat: 25.1252128325,
            lng: 55.1169911987
        },
        description: " ",
        // marker: null
    },
    {
        title: 'Dubai Gold Souk',
        location: {
            lat: 25.269665588,
            lng: 55.29249883
        },
        description: " ",
        // marker: null
    },
    {
        title: 'Ski Dubai',
        location: {
            lat: 25.116999532,
            lng: 55.192332564
        },
        description: " ",
        // marker: null
    },
    {
        title: 'Dubai Zoo',
        location: {
            lat: 25.222382,
            lng: 55.256558
        },
        description: " ",
        // marker: null
    },
    {
        title: 'Dubai Motor City',
        location: {
            lat: 25.0450,
            lng: 55.2397
        },
        description: " ",
        // marker: null
    },
    {
        title: 'Dubai International Airport',
        location: {
            lat: 25.2532,
            lng: 55.3657
        },
        description: " ",
        // marker: null
    },
    {
        title: 'The Marina Torch',
        location: {
            lat: 25.087942,
            lng: 55.147499
        },
        description: " ",
        // marker: null
    }
];

var Place = function (data) {
    this.title = ko.observable(data.title);
    this.longitude = ko.observable(data.location.lng);
    this.latitude = ko.observable(data.location.lat);
    this.location = ko.computed(function () {
        return this.longitude() + " " + this.latitude();
    }, this);
    this.description = ko.observable(data.description);
    this.marker = ko.observable(data.marker);
};

// VIEWMODEl
var ViewModel = function () {
    var self = this;
    this.listOfPlaces = ko.observableArray([]);

    places.forEach(function (place) {
        self.listOfPlaces.push(new Place(place));
    });

    self.hideMarkers = function () {
        for (i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
    };

    // Hide and show naviagtion menus in mobile and desktop
    self.showMenu = function() {
        $(".menu-list").css('width','60%');
    };

    self.closeMenu = function() {
        $(".menu-list").css('width','0');
    };

    this.currentPlace = ko.observable(this.listOfPlaces()[0]);

    // show place description
    self.showDescription = ko.observable(false);

    self.showCurrentPlace = function (place) {
        self.showDescription(true);
        $.ajax({
            url: 'http://en.wikipedia.org/w/api.php',
            data: {
                format: "json",
                action: "query",
                list: "search",
                srsearch: this.title(),
                formatversion: 2
            }, dataType: 'jsonp',
            headers: {
                'Api-User-Agent': 'MyCoolTool/1.1 (http://example.com/MyCoolTool/; MyCoolTool@example.com) BasedOnSuperLib/1.4'
            },
        }).done(function (data) {
            function strip(html){
                var doc = new DOMParser().parseFromString(html, 'text/html');
                return doc.body.textContent || "";
             }
            var changetoText = strip(data.query.search["0"].snippet + data.query.search["1"].snippet);
            place.description(changetoText);
        }).fail(function (err) {
            alert("Something went wrong :(");
        });
    };


    // HANDLE FILTERING OF INPUT
    this.query = ko.observable("");
    this.searchResults;
    this.searchResultsM;

    self.filteredRecords = ko.computed(function () {
        for (i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        self.hideMarkers();

        if (!self.query()) {
            searchResults = self.listOfPlaces();
            searchResultsM = markers;
        } else {
            searchResults = ko.utils.arrayFilter(self.listOfPlaces(), function (place) {

                return (
                    (self.query().length === 0 || place.title().toLowerCase().indexOf(self.query().toLowerCase()) > -1)
                )
            });

            searchResultsM = ko.utils.arrayFilter(markers, function (marker) {

                return (
                    (self.query().length === 0 || marker.title.toLowerCase().indexOf(self.query().toLowerCase()) > -1)
                );
            });
        }
        for (i = 0; i < searchResultsM.length; i++) {
            searchResultsM[i].setMap(map);
        }
        return searchResults;

    });

};

ko.applyBindings(new ViewModel());
