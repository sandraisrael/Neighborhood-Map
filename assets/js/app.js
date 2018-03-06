// MODEL FOR DATA OF PLACES IN NEIGHBORHOOD
var places = [
    {
        title: 'Dubai Mall',
        location: {
            lat: 25.1985,
            lng: 55.2796
        },
        description: " "
    },
    {
        title: 'Burj Khalifa',
        location: {
            lat: 25.197525,
            lng: 55.274288
        },
        description: " "
    },
    {
        title: 'Burj Al Arab',
        location: {
            lat: 25.141050,
            lng: 55.185978
        },
        description: " "
    },
    {
        title: 'Atlantis, The Palm',
        location: {
            lat: 25.1252128325,
            lng: 55.1169911987
        },
        description: " "
    },
    {
        title: 'Dubai Gold Souk',
        location: {
            lat: 25.269665588,
            lng: 55.29249883
        },
        description: " "
    },
    {
        title: 'Ski Dubai',
        location: {
            lat: 25.116999532,
            lng: 55.192332564
        },
        description: " "
    }
];

var Place = function (data) {
    this.title = ko.observable(data.title);
    this.longitude = ko.observable(data.location.lng);
    this.latitude = ko.observable(data.location.lat);
    this.location = ko.computed(function () {
        return this.longitude() + " " + this.latitude();
    }, this)
    this.description = ko.observable(data.description);
}

// VIEWMODEl
var ViewModel = function () {
    var self = this;
    this.listOfPlaces = ko.observableArray([]);

    places.forEach(function (place) {
        self.listOfPlaces.push(new Place(place));
    })

    this.currentPlace = ko.observable(this.listOfPlaces()[0]);

    self.showCurrentPlace = function (place) {
        $.ajax({
            url: 'https://en.wikipedia.org/w/api.php',
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
            console.log(data.query.search["0"].snippet);
            place.description(data.query.search["0"].snippet)
        }).fail(function (err) {
            console.log("Something went wrong :(")
        })
    }

    // HANDLE FILTERING OF INPUT
    this.query = ko.observable("");
    this.searchResults;

    self.filteredRecords = ko.computed(function () {
        if (!self.query()){
            searchResults = self.listOfPlaces();
        } else {
            searchResults = ko.utils.arrayFilter(self.listOfPlaces(), function (place) {
                
                return (
                    (self.query().length == 0 || place.title().toLowerCase().indexOf(self.query().toLowerCase()) > -1)
                )
            });
        }

        return searchResults;
    });


}

ko.applyBindings(new ViewModel())
