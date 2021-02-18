// Create function to create base map
function createMap(earthquakes) {

    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      tileSize: 256,
      maxZoom: 18,
      id: "light-v10",
      accessToken: API_KEY
    });
  
    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
      "Light Map": lightmap
    };
  
    // Create an overlayMaps object to hold the earthquakes layer
    var overlayMaps = {
      "Earthquakes": earthquakes
    };
  
    // Create the map object with options
    var map = L.map("map", {
      center: [37, -120],
      zoom: 5,
      layers: [lightmap, earthquakes]
    });
  
    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
  
    // Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      var div = L.DomUtil.create('div', 'info legend');
      labels = [],
      colors = ['#64fc5c','#98f951','#d2f547','#f1d33d','#ed8833','#e83a2a'],
      categories = ['0-1','1-2','2-3','3-4','4-5','5+'];
  
      div.innerHTML = '';
  
      for (var i = 0; i < categories.length; i++) {
              div.innerHTML += '<i style="background:' + colors[i] 
              + '">&nbsp;&nbsp;</i>&nbsp;&nbsp;' + categories[i] + '<br>'; 
          }
      return div;
    };
    
    legend.addTo(map);
  }
  
  // Create function to determine color of circle based on magnitude
  function getColor(d) {
    return d <= 1 ? '#64fc5c' :
           d <= 2 ? '#98f951' :
           d <= 3 ? '#d2f547' :
           d <= 4 ? '#f1d33d' :
           d <= 5 ? '#ed8833' :
                    '#e83a2a';
  }
  
  // Create function to create markers layer
  function createMarkers(response) {
    
    // Pull the "features" property off of response
    var features = response.features;
  
    // Initialize an array to hold earthquakes 
    var earthquakes = [];
  
    // Loop through the earthquakes array
    for (var index = 0; index < features.length; index++) {
      var feature = features[index];
  
      // For each earthquake, create a marker and bind a popup with the earthquake's name
      var earthquake = L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
        fillColor: getColor(feature.properties.mag),
        weight: 0.5,
        radius: 10000 * feature.properties.mag,
        opacity: 1,
        color: 'black',
        fillOpacity: 1
      })
        .bindPopup("<h3>Magnitude: " + feature.properties.mag + "</h3><h3>Longitude: " + feature.geometry.coordinates[0] + "</h3><h3>Latitude: " + feature.geometry.coordinates[1] + "</h3>");
  
      // Add the marker to the earthquakes array
      earthquakes.push(earthquake);
    }
  
    // Create a layer group made from the earthquake markers array, pass it into the createMap function
    createMap(L.layerGroup(earthquakes));
  }
  
  // Get json data from url and pass it to createMarkers function to add earthquake markers
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson", createMarkers);
  
  