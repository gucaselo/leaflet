// Create initial map object
var myMap = L.map("map", {
  center: [37.0902, -95.7129],
  // center: [36.7783, -119.4179],
  zoom: 5
});

function randomColors(n) {
  var randomColorsArray = [];
  for (var i = 0; i < n.length; i++) {
    var randomNumber = Math.floor(Math.random()*16777215).toString(16);
    randomColorsArray.push(`#${randomNumber}`);
  }
  return randomColorsArray;
};

function getColor(d) {
  return d > 30  ? '#191D0A' :
         d > 25  ? '#3A4317' :
        //  d > 20  ? '#BD0026' :
         d > 15  ? '#5A6A24' :
        //  d > 10  ? '#7C9130' :
         d > 5  ? '#7C9130' :
        //  d > 0  ? '#BD0026' :
                  '#9DB83B';
}

var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query.geojson?starttime=2021-04-19%2000:00:00&endtime=2021-04-26%2023:59:59&maxlatitude=50&minlatitude=24.6&maxlongitude=-65&minlongitude=-125&minmagnitude=2.5&orderby=time"

d3.json(queryUrl).then(function(data){

    // var latitude = +data.features[0].geometry.coordinates[1]
    // var longitude = +data.features[0].geometry.coordinates[0]
    // var depth = +data.features[0].geometry.coordinates[2]
    // var magnitude = +data.features[0].properties.mag
    // var coordinates = [latitude, longitude];

    // console.log(`Lng: ${latitude}, Lat: ${longitude} and Depth: ${depth}`);
    // console.log(data.features.length)

    // var depthArr = []

    for (i=0; i<data.features.length; i++) {
        var latitude = +data.features[i].geometry.coordinates[1]
        var longitude = +data.features[i].geometry.coordinates[0];
        var depth = +data.features[i].geometry.coordinates[2];
        var magnitude = +data.features[i].properties.mag;
        var coordinates = [latitude, longitude];

        var legend = L.control({position: 'bottomright'});

        // depthArr.push(depth)
        // console.log()
        colors = getColor(depth)
        // console.log(magnitude)

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
      
          // loop through our density intervals and generate a label with a colored square for each interval
          for (var i = 0; i < grades.length; i++) {
              div.innerHTML +=
                  '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                  grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
          }
      
          return div;
      };
      
        /////////////////////////////////////////////////////////


  }
  // Add legend to map
  legend.addTo(myMap);
  
  // console.log(d3.min(depthArr))
  // console.log(d3.max(depthArr))
  });