var parseDBJson = function(json) {
  var hits = json.hits.total;
  var geoJsonContainer = 
  {
    "type": "FeatureCollection",
    "features": []
  };

  for (var i = 0; i < hits; i++) {
    var trip = json.hits.hits[i]["_source"];
    var duration = trip["trip_duration"];
    var start_terminal = trip["start_terminal"];
    var end_terminal = trip["end_terminal"];
    var bike_id = trip["bike_id"];

    var geoJsonResults = buildGeoJson(duration, start_terminal, end_terminal, bike_id);
    if (geoJsonResults){
    geoJsonContainer.features.push(geoJsonResults);
    }
  };

  return geoJsonContainer;
}

var buildGeoJson = function(duration, start, end, id) {
  var coordinates = dockRoutes[start + '-' + end];
  var geoJson = null
  if (coordinates){
    geoJson = 
    {
      "type": "Feature",
      "properties": {
        "duration":duration, 
        "bikeID": id
        },
      "geometry": {
        "type": "LineString",
        "coordinates": coordinates.geometry.coordinates
      }
    };
}
  return geoJson;
}