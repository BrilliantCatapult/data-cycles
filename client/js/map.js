var d3geotile = require('d3.geo.tile')();
var Moment = require('moment');
var queue = require('queue-async');
var helperFunctions = require('./buildgeojson');
var dateDocksFormat = d3.time.format("%Y/%m/%d");
var dateMinValue = '2013-08-29';
var dateMaxValue = '2014-09-01';

var width, height;
var second = 1000;
var minute = 60 * second;
var hour = 60 * minute;
var day = 24 * hour;

var dbJson;
play = false;
var realtime;
var bikesJson;
var bikes = [];
var docks = [];
var speed = 15;
var speedMax = 1;
var speedMin = 20;

var animduration = speed * minute;
var timer, timermemo;
playmemo = false;

var colors = [];

updateWindow = function(){
    width = document.getElementById("map").clientWidth;
    height = Math.max(500, window.innerHeight);
};

var timeToMilliSeconds = function (string) {
  var values = string.split(":");
  var result = Number(values[0]) * hour + Number(values[1]) * minute;
  // console.log(formatTimeToMs(string), result);
  return result;
};

var formatMsToDate = function(ms) {
  return new Date(ms);
}
var formatHourMinutes = d3.time.format("%H:%M");

var formatTimeToMs = function(time) {
  // console.log("t: ", time, formatHourMinutes.parse(time), formatMilliseconds(formatHourMinutes.parse(time)));
  return formatMilliseconds(formatHourMinutes.parse(time));
}

var formatMoment = function(date, format){
  return Moment(date).format(format)
};

var formatMilliseconds = function (d) {
  var hours = Math.floor(d / hour);
  var minutes = Math.floor((d % hour) / minute);
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  return hours + ":" + minutes;
};

var mapModule = function(start_date, end_date, view){

  var fetchNewDate = function(){
    dateStartValue = formatMoment(start_date, "YYYY/MM/DD");
    var tripStartDate = formatMoment(start_date, "M/D/YYYY");

  var ready = function (error, tripJson, docksJson) {
    if (error) {
      console.log("error", error);
    }
    bikesJson = helperFunctions.buildBikesJson(tripJson);
    var docksHash = helperFunctions.buildDocksHash(tripJson, docksJson);
    console.log("bikesJson--------->", bikesJson);
    console.log("docksHash --------->", docksHash);  
    drawRoutes(bikesJson);
    drawDocks(docksHash);
    renderZoom();
    loaded();
  };

  queue()
    .defer(d3.json, "/api/redis/trips?start_date=" + tripStartDate)
    .defer(d3.json, "/api/redis?start_date=" + dateStartValue)
    .await(ready);
};

  var calendarBrushing = function () {
    var start_date1 = calendarBrush.extent()[0];
    unload();

    if (d3.event.sourceEvent) { 
      start_date1 = calendarTimeScale.invert(d3.mouse(this)[0]);

      calendarBrush.extent([start_date, start_date]);

      if (d3.event.sourceEvent.type === 'mouseup') {
        start_date = Moment(start_date1).format("YYYY-MM-DD");
        view.context.router.transitionTo('map_datetime', {date: start_date, time: formatMilliseconds(realtime)});
        var day = Moment(start_date + " " + formatMilliseconds(realtime), "YYYY-MM-DD HH:mm");
        start_date = day.format("YYYY/MM/DD HH:mm")
        fetchNewDate();
      }
    }
    calendarHandlePositionSet(start_date1);
  }; 

  var timeBrushing = function() {
    if (d3.event.sourceEvent) {     
      realtime = dayscale.invert(d3.mouse(this)[0]);
      // renderFrame(0);
      var mid = Moment(start_date).format("YYYY-MM-DD");
      var day = Moment(mid + " " + formatMilliseconds(realtime), "YYYY-MM-DD HH:mm");
      start_date = day.format("YYYY/MM/DD HH:mm")
      view.context.router.transitionTo('map_datetime', {date: mid, time: formatMilliseconds(realtime)});
    }
    timeHandlePositionSet(realtime);
  };

  var speedBrushing = function() {
    if (d3.event.sourceEvent) {
      speed = speedScale.invert(d3.mouse(this)[0]);
      speedHandlePositionSet(speed);
      setAnimDuration(speed);
    }
  };

  var loaded = function () {
    button.attr("disabled", null);
    timeHandle.classed("hide", false);
    svgAnimations.select(".docks").classed("hide", false);
    realtime = timeToMilliSeconds(formatMoment(start_date, "HH:mm"));
    timer, timermemo = animscale.invert(realtime);
    setAnimDuration(speed);
    console.log("timermeo is ", formatMoment(start_date, "HH:mm"));
    console.log("timermeo is ", timeToMilliSeconds(formatMoment(start_date, "HH:mm")));
    dateDisplay.html(dateStartValue);
    setTimer(timermemo); 
    timeHandlePositionSet(realtime);
    speedHandlePositionSet(speed);
    brushend();
  };

  var unload = function () {
    console.log("unload");
    button.attr("disabled", true);
    svgAnimations.selectAll("g").remove();
    button.html("Loading…");
  };

  var setAnimDuration = function(s){
    var animdurationtmp = animduration;
    animduration = s * minute;
    animscale = d3.scale.linear()
      .domain([0, animduration])
      .range([0, day]);
    // timermemo = timer * animdurationtmp / animduration;
  };

  var brushstart = function() {
    playmemo = play;
    play = false;
  };

  var brushend = function() {
    timer, timermemo = animscale.invert(realtime);
    if(playmemo) {
      play = true;
      d3.timer(animate);
    } else {
      button.html("Play");
    }
  };

  var timeHandlePositionSet = function(t){
    timeHandle.attr("transform", function (d) { return "translate(" + dayscale(t) + ")"; });
  };

  var speedHandlePositionSet = function() {
    speedHandle.attr("transform", function (d) { return "translate(" + speedScale(speed) + ")"; });
  };

  var calendarHandlePositionSet = function(date){
    calendarHandle.attr("transform", "translate(" + calendarTimeScale(date) + ",0)");
  }

  var setTimer = function(t) {
    realtime = animscale(t);
    var realTimeFormatted = formatMilliseconds(realtime);
    timerdisplay.html(realTimeFormatted);
    // console.log("timer", realTimeFormatted, timer);
  };

  var animate = function (e) {
    if (!play) {
      timermemo = timer;
      button.html("Play");
      return true;
    }
    button.html("Stop");
    renderFrame(e);
  };

  var renderFrame = function(e) {
    timer = (timermemo + e) % animduration;
    setTimer(timer); 
    timeHandlePositionSet(realtime); 

    for (var i = 0; i < bikes[0].length; i++) {
      d3.select(bikes[0][i])
        .attr("transform", function (d) { return moveBike(d, this); });
    }
    // console.log("docks[0]", docks[0]);
    for (var i = 0; i < docks[0].length; i++) {
      // console.log("docks[0][i]", d3.select(docks[0][i]).select(".gauge-qty"));
      setDockLevel(docks[0][i]);
    }
  };

var animateRing = function (id, color) {
  d3.select("#ring-" + id)
    .classed("hide", false)
    .attr("stroke", color)
    .transition()
    .ease("elastic")
    .duration(800)
    .attr("r", "20px")
    .each("end", function () {
      d3.select(this)
        .attr({
          r: "5px", 
          class: "hide ring"
        });
    });
};

var drawRing = function (id, color) {
  d3.select(id)
    .attr({
      r: "5px", 
      class: "hide ring"
    })
    .classed("hide", false)
    .attr("stroke", color)
    .transition()
    .ease("elastic")
    .duration(800)
    .attr("r", "20px");
};

var drawRoutes = function (data) {
  var routes = svgAnimations.append("svg:g")
    .classed("routes", true)
    .selectAll("path")
    .data(data.features)
    .enter()
    .append("svg:path")
    .attr({
      class: "route", 
      id: function(d){ return "route-" + d.properties.id }, 
      d: path, 
      "fill-opacity": 0
    });

  bikes = svgAnimations.append("svg:g")
    .classed("bikes", true)
    .selectAll("circle")
    .data(data.features)
    .enter()
    .append("circle")
    .attr({
      r: 8, 
      fill: '#f33', 
      class: "hide bike",
      id: function(d) { return "bike-" + d.properties.id }
    })
    .on("mouseover", function(d) { showBikeRoute(d, this); })
    .on("mouseout", function(){ hideBikesRoute(); });
    // .on("mousemove", function(){ return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
};

var hideBikesRoute = function() {
  tooltip.classed("hide", true);
  d3.selectAll(".route")
    .transition()
    .attr({
      "stroke-opacity": 0
    });
  d3.selectAll(".ring")
    .attr({
      class: "hide ring"
    });
  routesinfo.html("");
  routesInfolines.html("");
}

var showBikeRoute = function (d, bike) {
  var svgAnimationsPosition = svgAnimations.node().getBoundingClientRect();
  var position = bike.getBoundingClientRect(); 
  var left = position.left - svgAnimationsPosition.left - 76;
  var top = position.top - svgAnimationsPosition.top - 80;
  var trips = [];
  var id = d.properties.bikeID;
  var bikeSpeed = 1;
  var delay = 0;
  var delays = [delay];
  console.log(bikes);
  for (var i = 0; i < bikesJson.features.length; i++) {
    if (bikesJson.features[i].properties.bikeID == id) {
      delay += bikesJson.features[i].properties.duration/bikeSpeed;
      bikesJson.features[i].properties.delay = delay;
      trips.push(bikesJson.features[i].properties);
    }
  }

  animateBikeRoute(trips);
  // tooltip.attr({
  //     style: "left:" + left + "px;top:" + top + "px;"
  //   })
  //   .classed("hide", false)
  //   .html(id);

}

var animateBikeRoute = function(trips) {
  var routeIdsArray = [];
  var startRingIdsArray = [];
  var endRingIdsArray = [];
  var bikeSpeed = 1;
  var delay = 0;
  var delays = [delay];
  var svgAnimationsPosition = svgAnimations.node().getBoundingClientRect();

  for (var i = 0; i < trips.length; i++) {
    routeIdsArray.push("#route-" + trips[i].id); 
    startRingIdsArray.push("#ring-" + trips[i].startTerminal);
    endRingIdsArray.push("#ring-" + trips[i].endTerminal);
    delay += trips[i].duration/bikeSpeed;
    delays.push(delay);

    var routeInfoBlocPosition;

    var routeInfoBloc = routesinfo.append("div")
      .attr({
        class: function() {
          return "route-info-bloc";
        }
      })
      .html("<p>" + (i * 2 + 1) + ". " + trips[i].startTime + ": " + trips[i].startStation + "</p><p>" + (i * 2 + 2) + ". " + trips[i].endTime + ": " + trips[i].endStation + "<p>");

    var dock = d3.select("#dock-" + trips[i].endTerminal);
    var infoBlocPosition = routeInfoBloc.node().getBoundingClientRect();
    var startDockPosition = dock.node().getBoundingClientRect();
    var endDockPosition = dock.node().getBoundingClientRect();
    // array of coordinates of the lines between the bloc and their relative docks

    routesInfolines.append("line")          // attach a line
    .style("stroke", "red")  // colour the line
    .attr({
      "x1": startDockPosition.right - svgAnimationsPosition.left,   
      "y1": startDockPosition.top - svgAnimationsPosition.top,      
      "x2": infoBlocPosition.left - 10 - svgAnimationsPosition.left,     
      "y2": infoBlocPosition.top + 10 - svgAnimationsPosition.top
    });

    routesInfolines.append("line")          // attach a line
    .style("stroke", "blue")  // colour the line
    .attr({
      "x1": endDockPosition.right - svgAnimationsPosition.left,   
      "y1": endDockPosition.bottom - svgAnimationsPosition.top,   
      "x2": infoBlocPosition.left - 10 - svgAnimationsPosition.left,   
      "y2": infoBlocPosition.bottom - 10 - svgAnimationsPosition.top
    });

    var stepNumber = routesStepNumber.append("g")
      .attr({"class": "step-number"});


    // stepNumber.append("circle")
    //   .attr({
    //     r: 5,
    //     fill: "black",
    //     cx: function (d) { return projection(d.geometry.coordinates)[0]; }, 
    //     cy: function (d) { return projection(d.geometry.coordinates)[1]; }, 
    //   });

    // stepNumber.append("text")
    //     .attr("dx", function(d){return -10})
    //     .text(i * 2 + 1);

  }
  
  d3.selectAll(routeIdsArray.toString()).attr({
      "stroke-width": 2, 
      "stroke-linejoin": "round",
      "stroke": "blue", 
      "stroke-opacity": 1, 
      "stroke-linecap": "round"
    })
    .attr("stroke-dasharray", function(d, i) {
      var totalLength = d3.select(this).node().getTotalLength();
      return totalLength + " " + totalLength; 
    })
    .attr("stroke-dashoffset", function() { 
      var totalLength = d3.select(this).node().getTotalLength();
      return totalLength; 
    })
    .transition()
    .delay(function(d, i) { return delays[i]; })
    .duration(function(d, i) { 
      drawRing(startRingIdsArray[i], "orange");
      drawRing(endRingIdsArray[i], "blue");
      return d.properties.duration/bikeSpeed; })
    .ease("linear")
    .attr("stroke-dashoffset", 0);
};

var drawDocks = function (data) {
  // var c = d3.scale.linear()
  //   .domain([0, 27])
  //   .range([0, 1]);

  docks = svgAnimations.append("g")
    .classed("docks hide", true)
    .selectAll("g")
    .data(data.features)
    .enter()
    .append("g")
    .attr({
      id: function (d) { return "dock-" + d.properties.id }, 
      class: "dock"
    });

  docks.append("circle")
    .attr({
      cx: function (d) { return projection(d.geometry.coordinates)[0]; }, 
      cy: function (d) { return projection(d.geometry.coordinates)[1]; }, 
      r: "3px"
    });
    // .attr("fill", function (d) {
    //   return colorscale(c(d.properties.places))
    // });

  docks.append("rect")
    .attr({
      class: "gauge-bg",
      x: function (d) { return projection(d.geometry.coordinates)[0]; }, 
      y: function (d) { return projection(d.geometry.coordinates)[1]; }, 
      width: "8px", 
      transform: function (d) { return "translate(" + -4 + "," + -(d.properties.places + 6) + ")"; }, 
      height: function (d) { return d.properties.places + 2 ; }
    });

  docks.append("rect")
    .attr({
      class: "gauge-qty",
      x: function (d) { return projection(d.geometry.coordinates)[0]; }, 
      y: function (d) { return projection(d.geometry.coordinates)[1]; }, 
      width: "6px", 
      transform: function (d) { return "translate(" + -3 + "," + -(d.properties.places + 5) + ")"; }, 
      height: function (d) { return d.properties.places; }, 
      fill: "orange"
    });

  var rings = svgAnimations.append("g")
    .attr({class: "rings"})
    .selectAll("circle")
    .data(data.features)
    .enter()
    .append("circle")
    .attr({
      id: function (d) { return "ring-" + d.properties.id },
      class: "ring hide", 
      fill: "none",
      "stroke-width": "1px",
      r: "5px",
      cx: function (d) { return projection(d.geometry.coordinates)[0] }, 
      cy: function (d) { return projection(d.geometry.coordinates)[1] }
    });
};

  var setDockLevel = function (dock) {
    var currentQty = 0;
    
    d3.select(dock).select(".gauge-qty")
      .attr({
        transform: function (d) { 
          for (var i = 0; i < d.properties.activity.length; i++) {
            var changeTime = timeToMilliSeconds(d.properties.activity[i].time);
            if (changeTime < realtime) {
              currentQty = d.properties.activity[i].bikes_available;
            }
          }
          return "translate(" + -3 + "," + -(currentQty + 5) + ")";
        }, 
        height: function (d) { return currentQty; }
      });
  };

var moveBike = function(d, el) {
  var startTime = timeToMilliSeconds(d.properties.startTime);
  var endTime = timeToMilliSeconds(d.properties.endTime);
  if (realtime - startTime > 0 && endTime - realtime > 0) {
    if (d3.select(el).classed("hide")) {
      d3.select(el).classed("hide", false);
      if (play) {
        animateRing(d.properties.startTerminal, "red");
      }
    }
    var path = d3.select("#route-" + d.properties.id).node();
    var p = path.getPointAtLength(path.getTotalLength() * (realtime - startTime) / (endTime - startTime));
    return "translate(" + [p.x, p.y] + ")";
  } else {
    if (!d3.select(el).classed("hide")) {
      d3.select(el).classed("hide", true);
      if (play) {
        animateRing(d.properties.endTerminal, "green");
      }
    }
  } 
};

var renderZoom = function () {

  projection.scale(zoom.scale() / 2 / Math.PI)
    .translate(zoom.translate());
  
  var tiles = tile.scale(zoom.scale())
    .translate(zoom.translate())();

  var image = tilesLayer.style(prefix + "transform", matrix3d(tiles.scale, tiles.translate))
    .selectAll(".tile")
    .data(tiles, function (d) {
      return d;
    });

  image.exit()
    .each(function (d) {
      this._xhr.abort();
    })
    .remove();

  image.enter()
    .append("svg")
    .attr("class", "tile")
    .style("left", function (d) {
      return d[0] * 256 + "px";
    }).style("top", function (d) {
      return d[1] * 256 + "px";
    }).each(function (d) {

      var svgTile = d3.select(this);
      var layers = ['water', 'landuse', 'roads', 'buildings'];

      this._xhr = d3.json("https://vector.mapzen.com/osm/all/" + d[2] + "/" + d[0] + "/" + d[1] + ".json?api_key=vector-tiles-AVPulIE", function (error, json) {
          var k = Math.pow(2, d[2]) * 256; // size of the world in pixels
          
          tilePath.projection()
            .translate([k / 2 - d[0] * 256, k / 2 - d[1] * 256]) // [0°,0°] in pixels
            .scale(k / 2 / Math.PI);
          
          layers.forEach(function(layer){
            var data = json[layer];
            if (data) {
              svgTile.selectAll("path")
                .data(data.features.sort(function(a, b) { return a.properties.sort_key ? a.properties.sort_key - b.properties.sort_key : 0 }))
              .enter().append("path")
                .attr("class", function(d) { var kind = d.properties.kind || ''; return layer + ' ' + kind; })
                .attr("d", tilePath);
            }
          });
        });
    });

  svgAnimations.selectAll(".dock circle")
    .attr({
      cx: function (d) { return projection(d.geometry.coordinates)[0]; },
      cy: function (d) { return projection(d.geometry.coordinates)[1]; }
    });

  svgAnimations.selectAll(".gauge-qty")
    .attr({
      x: function (d) { return projection(d.geometry.coordinates)[0]; }, 
      y: function (d) { return projection(d.geometry.coordinates)[1]; }
    });

  svgAnimations.selectAll(".gauge-bg")
    .attr({
      x: function (d) { return projection(d.geometry.coordinates)[0]; }, 
      y: function (d) { return projection(d.geometry.coordinates)[1]; }
    });
  
  svgAnimations.selectAll(".route")
    .attr("d", path);

  svgAnimations.selectAll(".ring")
    .attr({
      cx: function (d) { return projection(d.geometry.coordinates)[0]; }, 
      cy: function (d) { return projection(d.geometry.coordinates)[1]; }
    });

  svgAnimations.selectAll(".bike")
    .attr({
      "transform": function(d) { return moveBike(d, this); }
    });
};

var mousemoved = function () {
  info.text(formatLocation(projection.invert(d3.mouse(this)), zoom.scale()));
};

var matrix3d = function (scale, translate) {
  var k = scale / 256,
    r = scale % 1 ? Number : Math.round;
  return "matrix3d(" + [k, 0, 0, 0, 0, k, 0, 0, 0, 0, k, 0, r(translate[0] * scale), r(translate[1] * scale), 0, 1] + ")";
};

var prefixMatch = function (p) {
  var i = -1,
    n = p.length,
    s = document.body.style;
  while (++i < n)
    if (p[i] + "Transform" in s) return "-" + p[i].toLowerCase() + "-";
  return ""; 
};

var formatLocation = function (p, k) {
  var format = d3.format("." + Math.floor(Math.log(k) / 2 - 2) + "f");
  return (p[1] < 0 ? format(-p[1]) + "°S" : format(p[1]) + "°N") + " " + (p[0] < 0 ? format(-p[0]) + "°W" : format(p[0]) + "°E");
};

updateWindow();

var prefix = prefixMatch(["webkit", "ms", "Moz", "O"]);

var colorscale = d3.scale.linear()
  .domain(d3.range(0, 1, 1.0 / (colors.length - 1)))
  .range(colors);

var timescale = d3.time.scale()
  .domain([new Date, new Date])
  .nice(d3.time.day)
  .range([0, width]);

var animscale = d3.scale.linear()
      .domain([0, animduration])
      .range([0, day]);

var dayscale = d3.scale.linear()
      .domain([0, day])
      .range([0, width]);

var timeBrush = d3.svg.brush()
  .x(dayscale)
  .on("brushstart", brushstart)
  .on("brush", timeBrushing)
  .on("brushend", brushend);

var axis = d3.svg.axis()
  .scale(timescale)
  .ticks(24)
  .tickFormat(d3.time.format("%H"))
  .orient("top");

var projection =  d3.geo.mercator()
  .scale((1 << 22) / 2 / Math.PI)
  .translate([-width / 2, -height / 2]);

var path = d3.geo.path()
  .projection(projection);

var tile = d3.geo.tile()
  .size([width, height]);

var tilePath = d3.geo.path()
  .projection(projection);

var zoom = d3.behavior.zoom()
  .scale(projection.scale() * 2 * Math.PI).scaleExtent([1 << 20, 1 << 23])
  .translate(projection([-122.4, 37.785])
  .map(function (x) {
    console.log('zoom', x);
    return -x;
  }))
  .on("zoom", renderZoom);

var map = d3.select("#map")
  .call(zoom)
  .on("mousemove", mousemoved);

var routesinfo = d3.select("#routes-info");

var tilesLayer = d3.select("#tileslayer");

var svgAnimations = map.append("svg:svg")
  .attr("id", 'animations')
  .style("width", width + "px")
  .style("height", height - 50 + "px")
  .call(zoom);

var routesInfolines = svgAnimations.append("g")
  .attr("id", 'routes-info-lines')

var routesStepNumber = svgAnimations.append("g")
  .attr("id", 'routes-step-number')

var info = map.append("div")
  .attr("class", "info");

var timelineSvg = d3.select("#timeline")
  .append("svg")
  .attr("width", width);

var button = d3.select("#playbutton")
  .attr('disabled', true);

var tooltip = d3.select(".map-tooltip");

var timerdisplay = d3.select("#time");

var dateDisplay = d3.select("#date");

var calendarSvg = d3.select("#calendar")
  .append("svg")
  .attr("width", width);

var speedSvg = d3.select("#speed")
  .append("svg")
  .attr("width", speedSliderSize);

projection.scale(zoom.scale() / 2 / Math.PI)
  .translate(zoom.translate());

button.on("click", function () {
  play = !play;
  if (play) {
    d3.timer(animate);
  } 
});

window.addEventListener('resize', updateWindow);
fetchNewDate();

var slider = timelineSvg.append("g")
  .attr("transform", "translate(0,20)")
  .call(axis)
  .call(timeBrush);

var timeHandle = slider.append("polygon")
  .attr("points", "-15,20 0,0 15,20")
  .attr("id", "handle")
  .classed("hide", true);

// speed slider
var speedSliderSize = "100";
var speedScale = d3.scale.linear()
  .domain([speedMin, speedMax])
  .range([0, speedSliderSize])
  .clamp(true);

var speedSliderBrush = d3.svg.brush()
  .x(speedScale)
  .on("brushstart", brushstart)
  .on("brush", speedBrushing)
  .on("brushend", brushend);

var speedSliderAxis = d3.svg.axis()
  .scale(speedScale)
  .orient("top");

var speedSlider = speedSvg.append("g")
  .attr("transform", "translate(0,20)")
  .call(speedSliderAxis)
  .call(speedSliderBrush); 

var speedHandle = speedSlider.append("polygon")
  .attr("points", "-15,20 0,0 15,20")
  .attr("id", "speedhandle");

// calendar

var calendarTimeScale = d3.time.scale()
  .domain([new Date(dateMinValue), new Date(dateMaxValue)])
  .range([0, width])
  .clamp(true);

var calendarBrush = d3.svg.brush()
  .x(calendarTimeScale)
  .extent([new Date(dateStartValue), new Date(dateStartValue)])
  .on("brushstart", brushstart)
  .on("brush", calendarBrushing);

var calendarAxis = d3.svg.axis()
  .scale(calendarTimeScale)
  .tickFormat(d3.time.format("%B"))
  .orient("top");

var calendarSlider = calendarSvg.append("g")
  .attr("transform", "translate(0,20)")
  .attr("class", "calendar-axis")
  .call(calendarAxis); 

calendarSlider.selectAll(".calendar-axis .tick text")
  .attr("x", 5)
  .attr("dy", null)
  .style("text-anchor", "start");

calendarSlider.selectAll(".calendar-axis .tick line")
    .attr("y2", "-18");

calendarSlider.call(calendarBrush);

var calendarHandle = calendarSlider.append("polygon")
  .attr("points", "-15,20 0,0 15,20")
  .attr("id", "calendarhandle");

calendarSlider
  .call(calendarBrush.event);
}

module.exports = mapModule;