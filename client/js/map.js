var width, height;
var second = 1000;
var minute = 60 * second;
var hour = 60 * minute;
var day = 24 * hour;

var dbJson;
var play = false;
var realtime;
var bikes = [];
var docks = [];
var animduration = 15 * minute;
var timer, timermemo = 0.313 * animduration;
var playmemo;

var colors = ["#FF0000", "#FF1100", "#FF2300", "#FF3400", "#FF4600", "#FF5700", "#FF6900", "#FF7B00", "#FF8C00", "#FF9E00", "#FFAF00", "#FFC100", "#FFD300", "#FFE400", "#FFF600", "#F7FF00", "#E5FF00", "#D4FF00", "#C2FF00", "#B0FF00", "#9FFF00", "#8DFF00", "#7CFF00", "#6AFF00", "#58FF00", "#47FF00", "#35FF00", "#24FF00", "#12FF00", "#00FF00"];

var formatMilliseconds = function (d) {
  var hours = Math.floor(d / hour);
  var minutes = Math.floor((d % hour) / minute);
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  return hours + ":" + minutes;
};

var timeToMilliSeconds = function (string) {
  var values = string.split(":");
  return values[0] * hour + values[1] * minute;
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
      id: function(d){
        return "route-" + d.properties.id
      }, 
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

    // .on("mousemove", function(){ return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
    .on("mouseout", function(){ hideBikesRoute(); });

  renderZoom();
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
  var speed = 1;
  var delay = 0;
  var delays = [delay];

  for (var i = 0; i < bikesJson.features.length; i++) {
    if (bikesJson.features[i].properties.bikeID == id) {
      delay += bikesJson.features[i].properties.duration/speed;
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
  var speed = 1;
  var delay = 0;
  var delays = [delay];
  var svgAnimationsPosition = svgAnimations.node().getBoundingClientRect();

  for (var i = 0; i < trips.length; i++) {
    routeIdsArray.push("#route-" + trips[i].id); 
    startRingIdsArray.push("#ring-" + trips[i].startTerminal);
    endRingIdsArray.push("#ring-" + trips[i].endTerminal);
    delay += trips[i].duration/speed;
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
      return d.properties.duration/speed; })
    .ease("linear")
    .attr("stroke-dashoffset", 0);
};

var unload = function () {
  console.log("unload");
  button.attr("disabled", true);
  svgAnimations.selectAll("g").remove();
  button.html("Loading…");
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

  renderZoom();
};

var setHandlePosition = function(t){
  handle.attr("transform", function (d) { return "translate(" + animscale(t) + ")"; });
};

var setTimer = function(t) {
  realtime = t * day / animduration;
  var realTimeFormatted = formatMilliseconds(realtime);
  timerdisplay.html(realTimeFormatted);
  // console.log("timer", realTimeFormatted, timer);
}

var brushstart = function() {
  playmemo = play;
  play = false;
};

var brushing = function() {
  if (d3.event.sourceEvent) { 
    timermemo = animscale.invert(d3.mouse(this)[0]);
    setHandlePosition(timermemo);
    renderFrame(0);
  }
};

var brushend = function() {
  if(playmemo) {
    play = true;
    d3.timer(animate);
  }
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
  setHandlePosition(timer);

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
  var tiles = tile.scale(zoom.scale())
    .translate(zoom.translate())();

  projection.scale(zoom.scale() / 2 / Math.PI)
    .translate(zoom.translate());
  
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

      this._xhr = d3.json("http://" + ["a", "b", "c"][(d[0] * 31 + d[1]) % 3] + ".tile.openstreetmap.us/vectiles-highroad/" + d[2] + "/" + d[0] + "/" + d[1] + ".json", function (error, json) {
        var k = Math.pow(2, d[2]) * 256; // size of the world in pixels
        
        tilePath.projection()
          .translate([k / 2 - d[0] * 256, k / 2 - d[1] * 256]) // [0°,0°] in pixels
          .scale(k / 2 / Math.PI);
        
        svgTile.selectAll("path")
          .data(json.features.sort(function (a, b) {
            return a.properties.sort_key - b.properties.sort_key;
          }))
          .enter()
          .append("path")
          .attr("class", function (d) { return d.properties.kind; })
          .attr("d", tilePath);
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

var loaded = function () {
  button.attr("disabled", null);
  handle.classed("hide", false);
  svgAnimations.select(".docks").classed("hide", false);
  setHandlePosition(timermemo);
  setTimer(timermemo); 
  button.html("Play");
};



function updateWindow(){
  width = document.getElementById("map").clientWidth;
  height = Math.max(500, window.innerHeight);
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
  .range([0, width]);

var brush = d3.svg.brush()
  .x(animscale)
  .extent([0, 0])
  .on("brushstart", brushstart)
  .on("brush", brushing)
  .on("brushend", brushend);

var axis = d3.svg.axis()
  .scale(timescale)
  .ticks(24)
  .tickFormat(d3.time.format("%H"))
  .orient("top");

var tile = d3.geo.tile()
  .size([width, height]);

var projection = d3.geo.mercator()
  .scale((1 << 22) / 2 / Math.PI)
  .translate([-width / 2, -height / 2]);

var path = d3.geo.path()
  .projection(projection);

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

var tilesLayer = map.append("div")
  .attr("id", "tileslayer");

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

var svgTimeline = d3.select("#timeline")
  .append("svg")
  .attr("width", width);

var slider = svgTimeline.append("g")
  .attr("transform", "translate(0,20)")
  .call(axis)
  .call(brush);

var button = d3.select("#playbutton")
  .attr('disabled', true);

var handle = slider.append("polygon")
  .attr("points", "-15,20 0,0 15,20")
  .attr("id", "handle")
  .classed("hide", true);

var tooltip = d3.select(".map-tooltip");

var timerdisplay = d3.select("#timer");

projection.scale(zoom.scale() / 2 / Math.PI)
  .translate(zoom.translate());

d3.json("/api/timeline", function (error, json) {
  if (error) {
    console.log("error", error);
  }
  bikesJson = buildBikesJson(json);
  // var docksHash = buildDocksHash(json);
  d3.json("/api/redis?start_date=2013/12/18", function(error, docksJson) {
    if (error) {
      console.log("error", error);
    }
    docksHash = buildDocksHash(json, docksJson);
    console.log("redis successsssss--------->", docksHash);
    drawRoutes(bikesJson);
    drawDocks(docksHash);
    // console.log("successsssss--------->", docksHash);
    console.log("successsssss--------->", bikesJson);
    loaded();

  });
  
});

button.on("click", function () {
  play = !play;
  if (play) {
    d3.timer(animate);
  } 
});

window.onresize = updateWindow;