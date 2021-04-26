// Create initial map object
var myMap = L.map("map", {
  center: [37.0902, -95.7129],
  // center: [36.7783, -119.4179],
  zoom: 5
});

function getColor(d) {
    return d > 30  ? '#581845' :
           d > 25  ? '#900C3F' :
           d > 15  ? '#C70039' :
           d > 5  ? '#FF5733' :
                    '#FFC305';
}

var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query.geojson?starttime=2021-04-19%2000:00:00&endtime=2021-04-26%2023:59:59&maxlatitude=50&minlatitude=24.6&maxlongitude=-65&minlongitude=-125&minmagnitude=2.5&orderby=time"

d3.json(queryUrl).then(function(data){

    for (i=0; i<data.features.length; i++) {
        var latitude = +data.features[i].geometry.coordinates[1]
        var longitude = +data.features[i].geometry.coordinates[0];
        var depth = +data.features[i].geometry.coordinates[2];
        var magnitude = +data.features[i].properties.mag;
        var coordinates = [latitude, longitude];

        var legend = L.control({position: 'bottomright'});

        colors = getColor(depth)

        L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
        }).addTo(myMap);  

        L.circle(coordinates, {
            fillOpacity: 1,
            color: colors,
            fillColor: colors,
            radius: magnitude * 15000,
        }).bindPopup("Earthquake").addTo(myMap);

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
  // Add legend to map
  legend.addTo(myMap);
  });