var d3geotile = require('d3.geo.tile')();
var Moment = require('moment');
var queue = require('queue-async');
var helperFunctions = require('./processJson');
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
var margins = 20;

var colors = [];

updateWindow = function(){
  width = document.getElementById("map").clientWidth;
  timelineWidth = document.getElementById("timeline").clientWidth;
  height = Math.min(500, window.innerHeight);
};

var timeToMilliSeconds = function (string) {
  var values = string.split(":");
  var result = Number(values[0]) * hour + Number(values[1]) * minute;
  return result;
};

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
      drawSvg(docksHash, bikesJson);
      renderZoom();
      view.setState({
        loaded: true
      });
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
      start_date1 = calendarScale.invert(d3.mouse(this)[0]);

      calendarBrush.extent([start_date, start_date]);

      if (d3.event.sourceEvent.type === 'mouseup') {
        start_date = Moment(start_date1).format("YYYY-MM-DD");
        view.context.router.transitionTo('map_datetime', {date: start_date, time: formatMilliseconds(realtime)});
        var day = Moment(start_date + " " + formatMilliseconds(realtime), "YYYY-MM-DD HH:mm");
        start_date = day.format("YYYY/MM/DD HH:mm");
        view.setState({
          loaded: false
        });
        fetchNewDate();
      }
    }
    dateDisplay.html(Moment(start_date1).format("YYYY/MM/DD"));
    calendarHandlePositionSet(start_date1);
  }; 

  var timeBrushing = function() {
    if (d3.event.sourceEvent) {     
      realtime = dayscale.invert(d3.mouse(this)[0]);
      timermemo = animscale.invert(realtime);
      renderFrame(0);
      var mid = Moment(start_date).format("YYYY-MM-DD");
      var day = Moment(mid + " " + formatMilliseconds(realtime), "YYYY-MM-DD HH:mm");
      start_date = day.format("YYYY/MM/DD HH:mm");
      view.context.router.transitionTo('map_datetime', {date: mid, time: formatMilliseconds(realtime)});
      view.setState({
        loaded: true
      });
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
    dateDisplay.html(dateStartValue);
    setTimer(timermemo); 
    timeHandlePositionSet(realtime);
    speedHandlePositionSet(speed);
    renderFrame(0);
    brushend();
  };

  var unload = function () {
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
    calendarHandle.attr("transform", "translate(" + calendarScale(date) + ",0)");
  }

  var setTimer = function(t) {
    realtime = animscale(t);
    var realTimeFormatted = formatMilliseconds(realtime);
    timerdisplay.html(realTimeFormatted);
  };

  var animate = function (e) {
    if (!play) {
      timermemo = timer;
      button.html("Play");
      return true;
    } else {
      button.html("Stop");
      renderFrame(e);
    }
  };

  var renderFrame = function(e) {
    timer = (timermemo + e) % animduration;
    setTimer(timer); 
    timeHandlePositionSet(realtime); 

    moveBikes();
    setDockLevel();
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

  d3.select("#routes-step-number").remove();

}

var showBikeRoutes = function (d, bike) {
  var routesStepNumber = svgAnimations.append("g")
    .attr("id", 'routes-step-number');
  var id = d.properties.bikeID;
  var bikeSpeed = 0.25;
  var delay = 0;
  var routeIdsArray = [];
  var startRingIdsArray = [];
  var endRingIdsArray = [];
  var steps = [];
  var positions = {};
  var counter = 0;
  var prevId;

  for (var i = 0; i < bikesJson.features.length; i++) {
    var trip = bikesJson.features[i].properties;
    if (trip.bikeID == id) {
      routeIdsArray.push("#route-" + trip.id); 
      startRingIdsArray.push("#ring-" + trip.startTerminal);
      endRingIdsArray.push("#ring-" + trip.endTerminal);

      var startTerminal = d3.select("#ring-" + trip.startTerminal);
      var endTerminal = d3.select("#ring-" + trip.endTerminal);

      positions[trip.startTerminal] = positions[trip.startTerminal] === undefined ? 1 : prevId === trip.startTerminal ? positions[trip.startTerminal] : positions[trip.startTerminal] +1;
      positions[trip.endTerminal] = positions[trip.endTerminal] === undefined ? 1 : positions[trip.endTerminal] +1;

      steps.push({
          "id": trip.startTerminal, 
          "position": positions[trip.startTerminal],
          "value": prevId === trip.startTerminal ? counter : ++counter, 
          "x": startTerminal.attr("cx"), 
          "y": startTerminal.attr("cy"), 
          "time": trip.startTime, 
          "station": trip.startStation,
          "type": "start"
        },
        {
          "id": trip.endTerminal, 
          "position": positions[trip.endTerminal],
          "value": ++counter, 
          "x": endTerminal.attr("cx"), 
          "y": endTerminal.attr("cy"), 
          "time": trip.endTime, 
          "station": trip.endStation, 
          "type": "end"
        } 
      );

      prevId = trip.endTerminal;
    }
  }

  routesinfo.selectAll("div")
    .data(steps)
    .enter()
    .append("div")
    .attr({
      class: function(d) { return d.type === "start" ? "route-info-bloc" : "route-info-bloc margin-bottom-xxs"; }
    })
    .html( function(d) { return '<span class="route-info-step">' + d.value + '</span><span class="route-info-time">' + d.time + '</span> <span class="route-info-name">' + d.station + '</span>' ; } );

  var stepNumber = routesStepNumber.selectAll("g")
    .data(steps)
    .enter()
    .append("g")
    .attr({
      "class": "step-number",
      "transform": function (d) { var x = Number(d.x) + d.position * 24; return "translate(" + x + ", " + d.y + ")"; }
    });

  stepNumber.append("circle")
    .attr("r", 10)
    .attr({
      fill: function(d) { return "black" }
    });

  stepNumber.append("text")
    .attr({ 
      // "dx": function(d) {return -5 }, 
      "dy": function(d) {return 3 },
      "text-anchor": "middle", 
      "fill": "white", 
      "font-weight": 700
    })
    .text(function(d){ return d.value });

  d3.selectAll(routeIdsArray.toString())
    .each(function(d) {
      d.totalLength = d3.select(this).node().getTotalLength();
      d.duration = d.totalLength/bikeSpeed;
      d.delay = delay;
      delay = d.delay + d.duration; 
    })
    .attr({
      "stroke-width": 4, 
      "stroke-linejoin": "round",
      "stroke": "#EA5004", 
      "stroke-opacity": 1, 
      "stroke-linecap": "round"
    })
    .attr("stroke-dasharray", function(d, i) {
      return d.totalLength + " " + d.totalLength; 
    })
    .attr("stroke-dashoffset", function(d, i) { 
      return d.totalLength; 
    })
    .transition()
    .delay(function(d, i) { return d.delay; })
    .duration(function(d, i) {
      return d.duration; })
    .ease("linear")
    .attr("stroke-dashoffset", 0)
    .each(function(d, i) {
      drawRing(startRingIdsArray[i], "black");
      drawRing(endRingIdsArray[i], "black");
    });

};


var drawSvg = function (dataDocks, dataBikes) {

  var routes = svgAnimations.append("svg:g")
    .classed("routes", true)
    .selectAll("path")
    .data(dataBikes.features)
    .enter()
    .append("svg:path")
    .attr({
      class: "route", 
      id: function(d){ return "route-" + d.properties.id }, 
      d: path, 
      "fill-opacity": 0
    });

  var rings = svgAnimations.append("g")
    .attr({class: "rings"})
    .selectAll("circle")
    .data(dataDocks.features)
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

  bikes = svgAnimations.append("svg:g")
    .classed("bikes", true)
    .selectAll("circle")
    .data(dataBikes.features)
    .enter()
    .append("circle")
    .attr({
      r: 7,  
      "stroke-width": "5",
      class: "hide bike",
      id: function(d) { return "bike-" + d.properties.id }
    })
    .on("mouseover", function(d) { brushstart(); showBikeRoutes(d, this); })
    .on("mouseout", function(){ brushend(); hideBikesRoute(); });
    // .on("mousemove", function(){ return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})

  docks = svgAnimations.append("g")
    .classed("docks hide", true)
    .selectAll("g")
    .data(dataDocks.features)
    .enter()
    .append("g")
    .attr({
      id: function (d) { return "dock-" + d.properties.id }, 
      class: "dock"
    });

  docks.append("circle")
    .attr({
      class: "dock-dot",
      r: 5,  
      "stroke-width": "3",
      cx: function (d) { return projection(d.geometry.coordinates)[0]; }, 
      cy: function (d) { return projection(d.geometry.coordinates)[1]; }
    });

  docks.append("rect")
    .attr({
      class: "dock-bg",
      x: function (d) { return projection(d.geometry.coordinates)[0]; }, 
      y: function (d) { return projection(d.geometry.coordinates)[1]; }, 
      width: "8px", 
      transform: function (d) { return "translate(" + -4 + "," + - (d.properties.places + 8) + ")"; }, 
      height: function (d) { return d.properties.places + 2 ; }
    });

  docks.append("rect")
    .attr({
      class: "dock-qty",
      x: function (d) { return projection(d.geometry.coordinates)[0]; }, 
      y: function (d) { return projection(d.geometry.coordinates)[1]; }, 
      width: "6px", 
      transform: function (d) { return "translate(" + -3 + "," + - (d.properties.places + 7) + ")"; }, 
      height: function (d) { return d.properties.places; }
    });
};

  var setDockLevel = function () {
    d3.selectAll(".dock-qty")
      .each(function(d) {
        for (var i = 0; i < d.properties.activity.length; i++) {
          var changeTime = timeToMilliSeconds(d.properties.activity[i].time);
          if (changeTime < realtime) {
            d.currentQty = d.properties.activity[i].bikes_available;
          }
        }
      })
      .attr({
        transform: function (d) { 
          return "translate(" + -3 + "," + - (d.currentQty + 7) + ")";
        }, 
        height: function (d) { return d.currentQty; }
      });
  };

var moveBikes = function() {
  bikes.attr("transform", function (d) { 
      var startTime = timeToMilliSeconds(d.properties.startTime);
      var endTime = timeToMilliSeconds(d.properties.endTime);
      if (realtime - startTime > 0 && endTime - realtime > 0) {
        if (d3.select(this).classed("hide")) {
          d3.select(this).classed("hide", false);
          if (play) {
            animateRing(d.properties.startTerminal, "#3d3d35");
          }
        }
        var path = d3.select("#route-" + d.properties.id).node();
        var p = path.getPointAtLength(path.getTotalLength() * (realtime - startTime) / (endTime - startTime));
        return "translate(" + [p.x, p.y] + ")";
      } else {
        if (!d3.select(this).classed("hide")) {
          d3.select(this).classed("hide", true);
          if (play) {
            animateRing(d.properties.endTerminal, "#EA5004");
          }
        }
      } 

      return ; 
    });
};

var renderZoom = function () {

  projection.scale(zoom.scale() / 2 / Math.PI)
    .translate(zoom.translate());
  
  var tiles = tile.scale(zoom.scale())
    .translate(zoom.translate())();

  var tilesLayerTiles = tilesLayer.style(prefix + "transform", matrix3d(tiles.scale, tiles.translate))
    .selectAll(".tile")
    .data(tiles, function (d) {
      return d;
    });

  tilesLayerTiles.exit()
    .each(function (d) {
      this._xhr.abort();
    })
    .remove();

  tilesLayerTiles.enter()
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

  // var waterTexture = 
  // d3.selectAll(".tile")
  //   .each(function (d, i) {

  //     var currentTile = d3.select(this);

  //     currentTile.attr("id", function() { return "tile-" + i; })

  //     currentTile.append("defs")
  //      .append('pattern')
  //      .attr('id', function() { return "pattern-" + i; })
  //      .attr('patternUnits', 'userSpaceOnUse')
  //      .attr('width', 16)
  //      .attr('height', 16)
  //      .append("image")
  //      .attr("xlink:href", "img/texture-lines.png")
  //      .attr('width', 16)
  //      .attr('height', 16);

  //   currentTile.selectAll(".water, .tile .ocean")
  //     .attr("fill", "url(#pattern-" + i + ")");

  //     console.log("tile", this, i, d);
      

  //   });

  svgAnimations.selectAll(".dock circle")
    .attr({
      cx: function (d) { return projection(d.geometry.coordinates)[0]; },
      cy: function (d) { return projection(d.geometry.coordinates)[1]; }
    });

  svgAnimations.selectAll(".dock-qty")
    .attr({
      x: function (d) { return projection(d.geometry.coordinates)[0]; }, 
      y: function (d) { return projection(d.geometry.coordinates)[1]; }
    });

  svgAnimations.selectAll(".dock-bg")
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

  moveBikes();
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
  .range([0, timelineWidth - (2 * margins)]);

var animscale = d3.scale.linear()
  .domain([0, animduration])
  .range([0, day]);

var dayscale = d3.scale.linear()
  .domain([0, day])
  .range([0, timelineWidth - (2 * margins)]);

var timeBrush = d3.svg.brush()
  .x(dayscale)
  .on("brushstart", brushstart)
  .on("brush", timeBrushing)
  .on("brushend", brushend);

var timeAxis = d3.svg.axis()
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
  .scale(projection.scale() * 2 * Math.PI)
  .scaleExtent([1 << 22, 1 << 23])
  .translate(projection([-122.4, 37.785])
    .map(function (x) {
      return -x;
    })
  )
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

var svgAnimationsPosition = svgAnimations.node().getBoundingClientRect();

console.log("svgAnimations", svgAnimations);

var info = map.append("div")
  .attr("class", "info");

var timelineSvg = d3.select("#timeline")
  .append("svg")
  .attr("width", timelineWidth);

var button = d3.select("#playbutton")
  .attr('disabled', true);

var tooltip = d3.select(".map-tooltip");

var timerdisplay = d3.select("#time");

var dateDisplay = d3.select("#date");

var calendarSvg = d3.select("#calendar")
  .append("svg")
  .attr("width", timelineWidth);

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

var timeSlider = timelineSvg.append("g")
  .attr("transform", "translate(20,24)")
  .attr("class", "time-axis")
  .call(timeAxis)
  .call(timeBrush);

var timeHandle = timeSlider.append("polygon")
  .attr("points", "-15,20 0,0 15,20")
  .attr("id", "handle")
  .classed("hide", true);

var speedSliderSize = "176";
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
  .ticks(2)
  .orient("top");

var speedSlider = speedSvg.append("g")
  .attr("transform", "translate(20,24)")
  .attr("class", "speed-axis")
  .call(speedSliderAxis)
  .call(speedSliderBrush); 

var speedHandle = speedSlider.append("polygon")
  // vertical slider handle: .attr("points", "0,0 20,-15  20,15")
  .attr("points", "-15,20 0,0 15,20")
  .attr("id", "speedhandle");

// calendar

var calendarScale = d3.time.scale()
  .domain([new Date(dateMinValue), new Date(dateMaxValue)])
  .range([0, timelineWidth - (2 * margins)])
  .clamp(true);

var calendarBrush = d3.svg.brush()
  .x(calendarScale)
  .extent([new Date(dateStartValue), new Date(dateStartValue)])
  .on("brushstart", brushstart)
  .on("brush", calendarBrushing);

var calendarAxis = d3.svg.axis()
  .scale(calendarScale)
  .tickFormat(d3.time.format("%B"))
  .orient("top");

var calendarSlider = calendarSvg.append("g")
  .attr("transform", "translate(20,24)")
  .attr("class", "calendar-axis")
  .call(calendarAxis); 

d3.selectAll(".calendar-axis .tick text, .time-axis .tick text, .speed-axis .tick text")
  .attr("x", 5)
  .attr("y", -12)
  .style("text-anchor", "start");

d3.selectAll(".calendar-axis .tick line, .time-axis .tick line, .speed-axis .tick line")
  .attr("y2", "-18");

// vertial slider
// d3.selectAll(".speed-axis .tick text")
//   .attr("y", -10)
//   .attr("x", -18)
//   .style("text-anchor", "start");

// d3.selectAll(".speed-axis .tick line")
//     .attr("x2", "-18");

calendarSlider.call(calendarBrush);

var calendarHandle = calendarSlider.append("polygon")
  .attr("points", "-15,20 0,0 15,20")
  .attr("id", "calendarhandle");

calendarSlider
  .call(calendarBrush.event);
}

module.exports = mapModule;