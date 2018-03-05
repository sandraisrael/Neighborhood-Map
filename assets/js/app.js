// MODEL FOR DATA OF PLACES IN NEIGHBORHOOD

var places = [
    {
        title: 'Dubai Mall',
        location: {
            lat: 25.1985,
            lng: 55.2796
        }
    },
    {
        title: 'Burj Khalifa',
        location: {
            lat: 25.197525,
            lng: 55.274288
        }
    },
    {
        title: 'Burj Al Arab',
        location: {
            lat: 25.141050,
            lng: 55.185978
        }
    },
    {
        title: 'Atlantis, The Palm',
        location: {
            lat: 25.1252128325,
            lng: 55.1169911987
        }
    },
    {
        title: 'Palm Jumieriah',
        location: {
            lat: 25.1087995648,
            lng: 55.1360111226
        }
    }
];

var Place = function(data){
    this.title = ko.observable(data.title);
    this.longitude = ko.observable(data.location.lng);
    this.latitude = ko.observable(data.location.lat);
    this.location = ko.computed(function (){
        return this.longitude() + " " + this.latitude();
    }, this)
}

// VIEWMODEl
var ViewModel = function(){
    var self = this;
    this.listOfPlaces = ko.observableArray([]);

    places.forEach(function(place){
        self.listOfPlaces.push(new Place(place));
    })
}

ko.applyBindings(new ViewModel())
