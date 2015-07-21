var addDockActivity = function(type, id, time) {
  // type is 'add' or 'remove'
  // id of dock
  // time in this format 0:00

  // if add 
  
}

var buildDocksJson = function (json) {
  var hits = json.hits.total;
  for (var i = 0; i < hits; i++) {
    var trip = json.hits.hits[i]["_source"];
    var startTime = trip["start_date"].split(" ")[1];
    var endTime = trip["end_date"].split(" ")[1];
    addDockActivity("add", trip["start_terminal"], startTime);
    addDockActivity("remove", trip["end_terminal"], endTime);
  }
  return docksJson;
};

var buildBikesJson = function (json) {
  var hits = json.hits.total;
  var bikesJson = {
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
    var bikeJson = buildBikeJson(duration, startTerminal, startDate, startTime, endTerminal, endDate, endTime, bikeID);
    if (bikeJson) {
      bikesJson.features.push(bikeJson);
    }
  };
  return bikesJson;
};
var buildBikeJson = function (duration, startTerminal, startDate, startTime, endTerminal, endDate, endTime, id) {
  var coordinates = bikeRoutes[startTerminal + "-" + endTerminal];
  var geoJson = null;
  if (!coordinates) {
    if (duration <= 240) {
      var coordinates = bikeRoutes[startTerminal + "-" + endTerminal + "s"];
    } else if (duration > 240 && duration <= 600) {
      var coordinates = bikeRoutes[startTerminal + "-" + endTerminal + "m"];
    } else if (duration > 600) {
      var coordinates = bikeRoutes[startTerminal + "-" + endTerminal + "l"];
    }
  }
  if (coordinates) {
    geoJson = {
      "type": "Feature",
      "properties": {
        "duration": duration,
        "bikeID": id,
        "startDate": startDate,
        "startTime": startTime,
        "endDate": endDate,
        "endTime": endTime,
        "startTerminal": startTerminal,
        "endTerminal": endTerminal
      },
      "geometry": {
        "type": "LineString",
        "coordinates": coordinates.geometry.coordinates
      }
    };
  } else console.log('coords not found', startTerminal, " and ", endTerminal)
  return geoJson;
};
