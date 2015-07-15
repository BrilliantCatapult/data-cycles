var getDist = function (lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
  }
  //avg cycling speed -> 15km/h


var testDock = function (num, dock) {
  if (num < 41) {
    num = 41
  } else if (num > 77 && num !== 82) {
    num = 82
  } else if (num === 43 || num === 44 || num === 52) {
    num = 50
  }
  if (num === dock) {
    num = num + 1
    testDock(num, dock)
  } else {
    return num
  }
}

var calcRoutes = function (routeStart, routeEnd) {
  L.Routing.control({
    waypoints: [
      L.latLng(routeStart.coord[0], routeStart.coord[1]),
      L.latLng(routeEnd.coord[0], routeEnd.coord[1])
    ],
  }).addTo(map).on('routeselected', function (e) {
    var route = e.route;
    for (var i = 0; i < route.coordinates.length; i++) {
      route.coordinates[i] = [route.coordinates[i][1], route.coordinates[i][0]]
    }
    arr.push(route.coordinates)
  });
}

var calcLoop = function (query) {
  var count = 0;
  var coords = [];
  var dist = distCalc(trip.duration) //??????
  var steps = routes[query].geometry.coordinates;
  if (routes[query].distance * 2 < dist) {

  } else {
    for (var i = 0; i < steps.length - 1; i++) {
      count += getDist(steps[i][0], steps[i][1], steps[i + 1][0], steps[i + 1][1]);
      coords.push(steps[i])
      if (count >= dist / 2) {
        (coords).concat(calcRoutes[steps[i], steps[0]]);
        break;
      }
    }
  }
  arr.push({
    "route": query.slice(0, 3) + query.slice(0, 2),
    "distance": count * 2,
    "geometry": {
      "type": "LineString",
      "coordinates": coords
    }
  })
}

var loop = function (num) {
  var dock = undefined;
  var arr = [];
  if (num < 60) {
    dock = Math.round(Math.random() * (Math.random() * 45) + num + 1)
    dock = testDock(dock, num)
  } else {
    dock = Math.round(Math.random() * (Math.random() * 30) + num - 30)
    dock = testDock(dock, num)
  }
  //search for route with:
  var query = (num).toString() + "-" + (dock).toString()
  calcLoop(query);
}

setTimeout(function () {
  console.log(JSON.stringify(arr))
}, 60000)


var distCalc = function (dock) {
  var longest = [];
  var shortest = [1, 2, 3, 4, 5, 6, 8, 9, 9, 90, 7, 5, 3, 2, 2, 2, 234, 324, 3, 2, 2, 2, 2, 3];
  var medium = false;
  for (var key in routes) {
    if (key.slice(0, 2) === dock) {
      if (routes[key].geometry.coordinates.length > longest.length) {
        longest = routes[key];
      }
      if (routes[key].geometry.coordinates.length < shortest.length) {
        shortest = routes[key];
      }
      if (routes[key].geometry.coordinates.length > 12 && routes[key].geometry.coordinates.length < 17) {
        medium = routes[key];
      }
    }
  }
  loopIt(shortest, medium, longest, dock)
}

var loopIt = function (shortest, medium, longest, dock) {
  shortest = shortest.geometry.coordinates.slice(0, shortest.geometry.coordinates.length - 1)
  if (!medium) {
    medium = longest.geometry.coordinates.slice(0, 3 * (longest.geometry.coordinates.length - 1) / 4)
  } else {
    medium = medium.geometry.coordinates.slice(0, medium.geometry.coordinates.length)
  }
  longest = longest.geometry.coordinates.slice(0, longest.geometry.coordinates.length - 1)
    // console.log(shortest[0], medium[0], longest[0])
  calcRoutes(shortest[shortest.length - 1], shortest[0], dock + "-" + dock + "s")
  calcRoutes(medium[medium.length - 1], medium[0], dock + "-" + dock + "m")
  calcRoutes(longest[longest.length - 1], longest[0], dock + "-" + dock + "l")
}