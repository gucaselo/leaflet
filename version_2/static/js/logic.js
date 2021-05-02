
function getColor(d) {
    return d > 30  ? '#581845' :
           d > 25  ? '#900C3F' :
           d > 15  ? '#C70039' :
           d > 5  ? '#FF5733' :
                    '#FFC305';
}

var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query.geojson?starttime=2021-04-19%2000:00:00&endtime=2021-04-26%2023:59:59&maxlatitude=50&minlatitude=24.6&maxlongitude=-65&minlongitude=-125&minmagnitude=2.5&orderby=time"
// var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query.geojson?starttime=2021-03-27%2000:00:00&endtime=2021-04-26%2023:59:59&maxlatitude=50&minlatitude=24.6&maxlongitude=-65&minlongitude=-125&minmagnitude=2.5&orderby=time"
// var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query.geojson?starttime=2021-04-19%2000:00:00&endtime=2021-04-26%2023:59:59&maxlatitude=53.226&minlatitude=12.383&maxlongitude=-65&minlongitude=-125&minmagnitude=1&orderby=time"

// Tectonic Plates
var link = "static/data/tectonicplates_GeoJSON/PB2002_boundaries.json"

// // Our style object
// var mapStyle = {
//     color: "white",
//     fillColor: "pink",
//     fillOpacity: 0.5,
//     weight: 1.5
//     };

// var tectonicMarkers = []

// // Grabbing our GeoJSON data..
// d3.json(link).then(function(data) {

//     tectonicMarkers.push(L.geoJson(data));

//     var tectonicPlates = L.layerGroup(tectonicMarkers)

//     // tectonicPlates.push(L.geoJson(data, {
//     //     // Passing in our style object
//     //     style: mapStyle
//     //   })
//     // );

// });

d3.json(queryUrl).then(function(data){
    d3.json(link).then(function(data2) {

    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
    });  

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
    });

    var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
    };

    var earthquakeMarker = [];
    var tectonicMarkers = []

    for (i=0; i<data.features.length; i++) {
        var latitude = +data.features[i].geometry.coordinates[1]
        var longitude = +data.features[i].geometry.coordinates[0];
        var depth = +data.features[i].geometry.coordinates[2];
        var magnitude = +data.features[i].properties.mag;
        var location = data.features[i].properties.place;
        var coordinates = [latitude, longitude];

        var legend = L.control({position: 'bottomright'});

        colors = getColor(depth)

        earthquakeMarker.push(L.circle(coordinates, {
            fillOpacity: 1,
            color: colors,
            fillColor: colors,
            radius: magnitude * 15000,
        }).bindPopup("<h3>Earthquake</h3><br><h5>Magnitude: " + magnitude + "</h5><br><h5>Location: " + location + "</h5>")
        );

        // Grabbing our Tectonic Plates GeoJSON data..
        // d3.json(link).then(function(data) {
        console.log(data2)
        // tectonicMarkers.push(L.geoJson(data2));
        var tectonicMarkers = L.geoJson(data2)
        // });

        

        // Create layer groups:
        var earthquake = L.layerGroup(earthquakeMarker);
        // var tectonicPlates = L.layerGroup(tectonicMarkers);

       // Create legend
        legend.onAdd = function (map) {
          var div = L.DomUtil.create('div', 'info legend'),
              grades = [-5, 5, 15, 25, 30],
              labels = [];

          // Loop through our density intervals and generate a label with a colored square for each interval
          for (var i = 0; i < grades.length; i++) {
              div.innerHTML +=
                  '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                  grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
          }
          return div;
      };
    }

    // Create initial map object
    var myMap = L.map("map", {
        center: [37.0902, -95.7129],
        // center: [36.7783, -119.4179],
        zoom: 5,
        layers: [streetmap, earthquake]
        });

    var overlayMaps = {
        Earthquakes: earthquake,
        "Tectonic Plates" : tectonicMarkers
    };

//     // Grabbing our GeoJSON data..
//     d3.json(link).then(function(data) {
//     // Creating a GeoJSON layer with the retrieved data
//     L.geoJson(data).addTo(myMap);
//     console.log(data)
//   });

    // Add legend to map
    legend.addTo(myMap);

    L.control.layers(baseMaps, overlayMaps, {
  }).addTo(myMap);

    });

});