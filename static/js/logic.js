var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createMap(data.features);
    console.log(data.features);
  });

function createMap(earthquakes) {
// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});

// Initialize all of the LayerGroups we'll be using
var layers = {
    a: new L.LayerGroup(),
    b: new L.LayerGroup(),
    c: new L.LayerGroup(),
    d: new L.LayerGroup(),
    e: new L.LayerGroup(),
    f: new L.LayerGroup(),
};

var markers = L.geoJson(earthquakes, {
    onEachFeature: function (feature, layer) {
      var props = feature.properties;

      layer.bindPopup('<h3>' + props.place + '</h3><hr><p> Magnitude: ' + props.mag +'</p>');
      mag = feature.properties.mag;
      var layerCode;
      if(mag > 5) {
        layerCode = "f"
      }
      else if(mag > 4) {
        layerCode = "e"
      }
      else if (mag > 3) {
        layerCode = "d"
      }
      else if (mag > 2){
        layerCode = "c"
      }
      else if (mag > 1) {
        layerCode = "b"
      }
      else {layerCode = "a"}
      layer.addTo(layers[layerCode]);
    },

    pointToLayer: function (feature, latlng) {
      var color,
          mag,
          radius;

      mag = feature.properties.mag;
      if (mag === null) {
        color = '#fff';
        radius = 2;
      } else {
        color = getColor(mag);
        radius = 2 * Math.max(mag, 1);
      }

      return L.circleMarker(latlng, {
        color: color,
        radius: radius
      });
    }
  });

// for (var i = 0; i<earthquakes.length; i++) {
//   mag = earthquakes[i].properties.mag;
//   if(mag > 5) {
//     markers.addTo(layers[f])
//   }
//   else if(mag > 4) {
//     markers.addTo(layers[e])
//   }
//   else if (mag > 3) {
//     markers.addTo(layers[d])
//   }
//   else if (mag > 2){
//     markers.addTo(layers[c])
//   }
//   else if (mag > 1) {
//     markers.addTo(layers[b])
//   }
//   else {markers.addTo(layers[a])}
// }  

// Create a baseMaps object to hold the lightmap layer
var baseMaps = {
"Light Map": lightmap
};

// Create the map with our layers
var map = L.map("map", {
    center: [40, -96],
    zoom: 5,
    layers: [
      layers.a,
      layers.b,
      layers.c,
      layers.d,
      layers.e,
      layers.f,
      markers
    ]
  });

lightmap.addTo(map);

// Create an overlays object to add to the layer control
var overlays = {
    "0-1": layers.a,
    "1-2": layers.b,
    "2-3": layers.c,
    "3-4": layers.d,
    "4-5": layers.e,
    "5+": layers.f
  };

// Create a control for our layers, add our overlay layers to it
L.control.layers(null, overlays).addTo(map);

// Create a legend to display information about our map
var legend = L.control({
    position: "bottomright"
  });
  
// When the layer control is added, insert a div with the class of "legend"
legend.onAdd = function() {
var div = L.DomUtil.create("div", "legend");
grades = [0, 1, 2, 3, 4, 5],
labels = [];

// loop through our density intervals and generate a label with a colored square for each interval
for (var i = 0; i < grades.length; i++) {
div.innerHTML +=
    '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
    grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
}

return div;
};

legend.addTo(map);

function getColor(d) {
    return d > 5 ? '#FF0000' :
           d > 4  ? '#FF3300' :
           d > 3  ? '#ff6600' :
           d > 2  ? '#FFCC00' :
           d > 1   ? '#FFFF00' :
                      '#00FF00';

}

// for(var i=0; i<locations.length; i++) {
// var location = locations[i];
// var coordinates = location.coordinates;
// console.log(coordinates);
// }

}

