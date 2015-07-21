var addDockActivity = function(type, id, time) {
  // type is 'add' or 'remove'
  // id of dock
  // time in this format 0:00

  // if add 
  
};

var calcDockHash = function(){
  var tripHash = {};
  var mins = 0;
  var hours = 0;
  
  for (var i = 0; i < 1440; i++){
      var time = countTime(hours, mins);
      hours = time[0];
      mins = time[1];
      time = time.join(":");
      tripHash[time] = {"starting_trips": [], "ending_trips": []};
  };

  return tripHash;

  // for (var i = 0; i < dbJson.features.length; i++){
  //   var startTime = dbJson.features[i]["properties"]["startTime"];
  //   var endTime = dbJson.features[i]["properties"]["endTime"];
  //   var splitStartTime = startTime.split(":");
  //   var splitEndTime = endTime.split(":");
  //   hours = splitStartTime[0];
  //   mins = splitStartTime[1];

  //   tripHash[startTime]["startingTrips"].push(i);

  //   // console.log(splitStartTime, splitEndTime);
  //   // console.log("hours and mins ", hours, mins);

  //   for (var h = splitStartTime[0], m = splitStartTime[1]; m < splitEndTime[1] && h <= splitEndTime[0]; h = hours, m = mins) {
  //     tempTime = h + ":" + m;
  //     // console.log("tempTime", tempTime);
  //     // var tempTime = countTime().join(":");
  //     // console.log(tempTime);
  //     tripHash[tempTime]["currentTrips"].push(i);
  //     mins = countTime()[1];
  //     // console.log("new hours and mins ", hours, mins);
  //   }
  // }
  // mins = 0;
  // hours = 0;

  // console.log(tripHash);
};



var countTime = function(hours, mins){
  var countHours, countMins;
  mins++
  if (mins === 60) {
    hours++;
    mins = 0;
    if (hours === 24){
      hours = 0;
    }
  }

  countHours = hours;

  if (mins < 10) {
    countMins = "0" + mins;
  }
  else {
    countMins = ""+ mins;
  }
  return [countHours, countMins];
};

var buildDocksHash = function (json) {
  var hits = json.hits.total;
  var dockHash = calcDockHash();

  for (var i = 0; i < hits; i++) {
    var trip = json.hits.hits[i]["_source"];
    var startTime = trip.start_date.split(" ")[1];
    var endTime = trip.end_date.split(" ")[1];
    
    dockHash[startTime].starting_trips.push(trip.start_terminal);
    
    if (trip.start_date.split(" ")[0] === trip.end_date.split(" ")[0]){
      dockHash[endTime].ending_trips.push(trip.end_terminal);
    }
  }
  return dockHash;
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
