 //This will only work with leaflet!
 /*
 //Creates leaflet map over San Francisco
 var map = L.map('map').setView([37.79, -122.42], 14);
 L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
   attribution: 'Brilliant Catapult',
   maxZoom: 17,
   minZoom: 3,
 }).addTo(map);

//Creates route with Leaflet Routing Machine
 var route = L.Routing.control({
   waypoints: [
     L.latLng(57.74, 11.94),
     L.latLng(57.6792, 11.949)
   ]
 }).addTo(map).on('routeselected', function (e) {
   var route = e.route;
   //Switches Coordinate Places
   for (var i = 0; i < route.coordinates.length; i++) {
     route.coordinates[i] = [route.coordinates[i][1], route.coordinates[i][0]]
   }
 });
*/

 //Coordinate location for all docks in SF area
 var docks = [{
   "dock": 41,
   "loc": "Clay at Battery",
   "coord": [37.795001, -122.39997],
   "amt": 15
 }, {
   "dock": 42,
   "loc": "Davis at Jackson",
   "coord": [37.79728, -122.398436, ],
   "amt": 15
 }, {
   "dock": 45,
   "loc": "Commercial at Montgomery",
   "coord": [37.794231, -122.402923],
   "amt": 15
 }, {
   "dock": 46,
   "loc": "Washington at Kearney",
   "coord": [37.795425, -122.404767],
   "amt": 15
 }, {
   "dock": 47,
   "loc": "Post at Kearney",
   "coord": [37.788975, -122.403452],
   "amt": 19
 }, {
   "dock": 48,
   "loc": "Embarcadero at Vallejo",
   "coord": [37.799953, -122.398525],
   "amt": 15
 }, {
   "dock": 49,
   "loc": "Spear at Folsom",
   "coord": [37.789625, -122.390264],
   "amt": 19
 }, {
   "dock": 50,
   "loc": "Harry Bridges Plaza (Ferry Building)",
   "coord": [37.795392, -122.394203],
   "amt": 23
 }, {
   "dock": 51,
   "loc": "Embarcadero at Folsom",
   "coord": [37.791464, -122.391034],
   "amt": 19
 }, {
   "dock": 53,
   "loc": "Powell Street BART",
   "coord": [37.783871, -122.408433],
   "amt": 19
 }, {
   "dock": 54,
   "loc": "Embarcadero at Bryant",
   "coord": [37.787152, -122.388013],
   "amt": 15
 }, {
   "dock": 55,
   "loc": "Temporary Transbay Terminal (Howard at Beale)",
   "coord": [37.789756, -122.394643],
   "amt": 23
 }, {
   "dock": 56,
   "loc": "Beale at Market",
   "coord": [37.792251, -122.397086],
   "amt": 19
 }, {
   "dock": 57,
   "loc": "5th at Howard",
   "coord": [37.781752, -122.405127],
   "amt": 15
 }, {
   "dock": 58,
   "loc": "San Francisco City Hall",
   "coord": [37.77865, -122.418235],
   "amt": 19
 }, {
   "dock": 59,
   "loc": "Golden Gate at Polk",
   "coord": [37.781332, -122.418603],
   "amt": 23
 }, {
   "dock": 60,
   "loc": "Embarcadero at Sansome",
   "coord": [37.80477, -122.403234],
   "amt": 15
 }, {
   "dock": 61,
   "loc": "2nd at Townsend",
   "coord": [37.780526, -122.390288],
   "amt": 27
 }, {
   "dock": 62,
   "loc": "2nd at Folsom",
   "coord": [37.785299, -122.396236],
   "amt": 19
 }, {
   "dock": 63,
   "loc": "Howard at 2nd",
   "coord": [37.786978, -122.398108],
   "amt": 19
 }, {
   "dock": 64,
   "loc": "2nd at South Park",
   "coord": [37.782259, -122.392738],
   "amt": 15
 }, {
   "dock": 65,
   "loc": "Townsend at 7th",
   "coord": [37.771058, -122.402717],
   "amt": 15
 }, {
   "dock": 66,
   "loc": "South Van Ness at Market",
   "coord": [37.774814, -122.418954],
   "amt": 19
 }, {
   "dock": 67,
   "loc": "Market at 10th",
   "coord": [37.776619, -122.417385],
   "amt": 27
 }, {
   "dock": 68,
   "loc": "Yerba Buena Center of the Arts (3rd @ Howard)",
   "coord": [37.784878, -122.401014],
   "amt": 19
 }, {
   "dock": 69,
   "loc": "San Francisco Caltrain 2 (330 Townsend)",
   "coord": [37.776377, -122.39607],
   "amt": 23
 }, {
   "dock": 70,
   "loc": "San Francisco Caltrain (Townsend at 4th)",
   "coord": [37.776317, -122.395569],
   "amt": 19
 }, {
   "dock": 71,
   "loc": "Powell at Post (Union Square)",
   "coord": [37.788446, -122.408499],
   "amt": 19
 }, {
   "dock": 72,
   "loc": "Civic Center BART (7th at Market)",
   "coord": [37.780356, -122.412919],
   "amt": 23
 }, {
   "dock": 73,
   "loc": "Grant Avenue at Columbus Avenue",
   "coord": [37.798522, -122.407245],
   "amt": 15
 }, {
   "dock": 74,
   "loc": "Steuart at Market",
   "coord": [37.794139, -122.394434],
   "amt": 23
 }, {
   "dock": 75,
   "loc": "Mechanics Plaza (Market at Battery)",
   "coord": [37.7913, -122.3990511],
   "amt": 9
 }, {
   "dock": 76,
   "loc": "Market at 4th",
   "coord": [37.786305, -122.404966],
   "amt": 19
 }, {
   "dock": 77,
   "loc": "Market at Sansome",
   "coord": [37.789625, -122.400811],
   "amt": 27
 }, {
   "dock": 82,
   "loc": "Broadway St at Battery St",
   "coord": [37.798541, -122.400862],
   "amt": 15
 }, ];

 // Holds all the dock routes
 var arr = [];
 //Uses Leaflet Routing Machine to calculate the coordinates along the route
 var calcRoutes = function (routeStart, routeEnd) {
     L.Routing.control({
       waypoints: [
         L.latLng(routeStart.coord[0], routeStart.coord[1]),
         L.latLng(routeEnd.coord[0], routeEnd.coord[1])
       ],
     }).addTo(map).on('routeselected', function (e) {
       var route = e.route;
       for (var i = 0; i < route.coordinates.length; i++) {
         //switch coordinate positions so that they fit geojson formatting
         route.coordinates[i] = [route.coordinates[i][1], route.coordinates[i][0]]
       }
       //push to storage the correct geojson object formatting
       arr.push({
         "type": "route",
         "properties": {
           "DockStart": routeStart.dock,
           "DockEnd": routeEnd.dock
         },
         "geometry": {
           "type": "LineString",
           "coordinates": route.coordinates
         }
       })
     });
   }
   //Prints the information to console after it has been calculated (3-minutes is a bit excessive)
 setTimeout(function () {
   console.log(JSON.stringify(arr))
 }, 180000)

 //Creates all possible combinations of docs
 var k_combinations = function (set, k) {
     var i, j, combs, head, tailcombs;
     if (k > set.length || k <= 0) {
       return [];
     }
     if (k == set.length) {
       return [set];
     }
     if (k == 1) {
       combs = [];
       for (i = 0; i < set.length; i++) {
         combs.push([set[i]]);
       }
       return combs;
     }
     combs = [];
     for (i = 0; i < set.length - k + 1; i++) {
       head = set.slice(i, i + 1);
       tailcombs = k_combinations(set.slice(i + 1), k - 1);
       for (j = 0; j < tailcombs.length; j++) {
         combs.push(head.concat(tailcombs[j]));
       }
     }
     return combs;
   }
   //makes combinations of tuples w/docks
 var combos = k_combinations(docks, 2);
 //passes each route combination to calcRoutes function to make coordinates
 //where first parameter is the start point obj and 2nd is end point obj
 for (var i = 0; i < combos.length; i++) {
   calcRoutes(combos[i][0], combos[i][1])
 }