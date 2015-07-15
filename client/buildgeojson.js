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
    var startTerminal = trip["start_terminal"];
    var endTerminal = trip["end_terminal"];
    var bikeID = trip["bike_id"];
    var tempStart = trip["start_date"].split(" ");
    var tempEnd = trip["end_date"].split(" ");
    var startDate = tempStart[0];
    var startTime = tempStart[1];
    var endDate = tempEnd[0];
    var endTime = tempEnd[1];

    var geoJsonResults = buildGeoJson(duration, startTerminal, startDate, startTime, endTerminal, endDate, endTime, bikeID);
    if (geoJsonResults){
    geoJsonContainer.features.push(geoJsonResults);
    }
  };

  return geoJsonContainer;
}

var buildGeoJson = function(duration, startTerminal, startDate, startTime, endTerminal, endDate, endTime, id) {
  var coordinates = dockRoutes[startTerminal + '-' + endTerminal]
  var geoJson = null

  if (coordinates){
    geoJson = 
    {
      "type": "Feature",
      "properties": {
        "duration":duration, 
        "bikeID": id,
        "startDate": startDate,
        "startTime": startTime,
        "endDate": endDate,
        "endTime": endTime
        },
      "geometry": {
        "type": "LineString",
        "coordinates": coordinates.geometry.coordinates
      }
    };
  }
  else console.log('coords not found', startTerminal, " and ", endTerminal )
  return geoJson;
}