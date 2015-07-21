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

var makeRings = function (id, color) {
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

var drawRoutes = function (data) {
  var routes = animations.append("svg:g")
    .classed("routes", true)
    .selectAll("path")
    .data(data.features)
    .enter()
    .append("svg:g")
    .attr("class", "route")
    .append("svg:path")
    .attr({
      d: path, 
      "fill-opacity": 0
    });

  bikes = animations.selectAll(".route")
    .append("circle")
    .attr({
      r: 3, 
      fill: '#f33', 
      class: "hide bike"
    });

  renderZoom();
};

var drawDocks = function (data) {
  var c = d3.scale.linear()
    .domain([0, 27])
    .range([0, 1]);

  docks = animations.append("g")
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

  var rings = animations.append("g")
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
    d3.select(docks[0][i]).select(".gauge-qty")
      .attr({
        transform: function (d) { return "translate(" + -3 + "," + -(d.properties.places + 5) + ")"; }, 
        height: function (d) { return d.properties.places; }
      });
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

  animations.selectAll(".dock circle")
    .attr({
      cx: function (d) { return projection(d.geometry.coordinates)[0]; },
      cy: function (d) { return projection(d.geometry.coordinates)[1]; }
    });

  animations.selectAll(".gauge-qty")
    .attr({
      x: function (d) { return projection(d.geometry.coordinates)[0]; }, 
      y: function (d) { return projection(d.geometry.coordinates)[1]; }
    });

  animations.selectAll(".gauge-bg")
    .attr({
      x: function (d) { return projection(d.geometry.coordinates)[0]; }, 
      y: function (d) { return projection(d.geometry.coordinates)[1]; }
    });
  
  animations.selectAll(".route path")
    .attr("d", path);

  animations.selectAll(".ring")
    .attr({
      cx: function (d) { return projection(d.geometry.coordinates)[0]; }, 
      cy: function (d) { return projection(d.geometry.coordinates)[1]; }
    });

  animations.selectAll(".bike")
    .attr({
      "transform": function(d) { return moveBike(d, this); }
    });
};

var moveBike = function(d, context) {
  var startTime = timeToMilliSeconds(d.properties.startTime);
  var endTime = timeToMilliSeconds(d.properties.endTime);

  if (realtime - startTime > 0 && endTime - realtime > 0) {
    if (d3.select(context).classed("hide")) {
      d3.select(context).classed("hide", false);
      if (play) {
        makeRings(d.properties.startTerminal, "red");
      }
    }
    var path = d3.select(context.parentNode).select("path").node();
    var p = path.getPointAtLength(path.getTotalLength() * (realtime - startTime) / (endTime - startTime));
    return "translate(" + [p.x, p.y] + ")";
  } else {
    if (!d3.select(context).classed("hide")) {
      d3.select(context).classed("hide", true);
      if (play) {
        makeRings(d.properties.endTerminal, "green");
      }
    }
  } 
} 

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
  button.attr('disabled', null);
  handle.classed("hide", false);
  animations.select(".docks").classed("hide", false);
  setHandlePosition(timermemo);
  setTimer(timermemo); 
  button.html("Play");
};

function updateWindow(){
  width = document.getElementById("map").clientWidth;
  height = Math.max(500, window.innerHeight);
};

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

var tilesLayer = map.append("div")
  .attr("id", "tileslayer");

var animations = map.append("svg:svg")
  .attr("id", 'bikeAnimations')
  .style("width", width + "px")
  .style("height", height - 50 + "px")
  .call(zoom);

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

var timerdisplay = d3.select("#timer");

projection.scale(zoom.scale() / 2 / Math.PI)
  .translate(zoom.translate());

d3.json("/api/timeline", function (error, json) {
  if (error) {
    console.log("error", error);
  }
  bikesJson = buildBikesJson(json);
  docksJson = buildDocksJson(json);
  console.log("successsssss--------->", bikesJson);
  drawRoutes(bikesJson);
  drawDocks(docksJson);
  loaded();
});

button.on("click", function () {
  play = !play;
  if (play) {
    d3.timer(animate);
  } 
});

updateWindow();
window.onresize = updateWindow;