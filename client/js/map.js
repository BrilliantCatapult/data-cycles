/*global window,prefixMatch,d3*/

var width = document.getElementById("map").clientWidth;
var height = Math.max(500, window.innerHeight);
var prefix = prefixMatch(["webkit", "ms", "Moz", "O"]);
var second = 1000;
var minute = 60 * second;
var hour = 60 * minute;
var day = 24 * hour;

var dbJson;
var play = false;
var realTimeFormatted;
var realtime;
var circles = [];
var animduration = 10 * minute;
var timer, timermemo = 0.35 * animduration;
var playmemo;

  //circle for bike (.route) radius down to 3
var colors = ["#FF0000", "#FF1100", "#FF2300", "#FF3400", "#FF4600", "#FF5700", "#FF6900", "#FF7B00", "#FF8C00", "#FF9E00", "#FFAF00", "#FFC100", "#FFD300", "#FFE400", "#FFF600", "#F7FF00", "#E5FF00", "#D4FF00", "#C2FF00", "#B0FF00", "#9FFF00", "#8DFF00", "#7CFF00", "#6AFF00", "#58FF00", "#47FF00", "#35FF00", "#24FF00", "#12FF00", "#00FF00"];

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

var button = d3.select("#playbutton");

var map = d3.select("#map")
  .append("div")
  .attr("class", "map")
  .style("width", width + "px")
  .style("height", height - 50 + "px")
  .call(zoom);

// .on("mousemove", mousemoved);
var tilesLayer = map.append("div")
  .attr("id", "maplayer");

var svgBikeAnimations = map.append("svg:svg")
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

var handle = slider.append("polygon")
  .attr("points", "-15,20 0,0 15,20")
  .attr("id", "handle");

var timerdisplay = d3.select("#timer");

projection.scale(zoom.scale() / 2 / Math.PI)
  .translate(zoom.translate());

function brushstart() {
  playmemo = play;
  console.log("playmemo a", playmemo);
  play = false;
};

function brushing() {
  if (d3.event.sourceEvent) { 
    timermemo = animscale.invert(d3.mouse(this)[0]);
    handle.attr("transform", function (d) {
      return "translate(" + animscale(timermemo) + ")";
    });
    renderFrame(0);
  }
};

function brushend() {
  console.log("playmemo", playmemo);
  if(playmemo) {
    play = true;
    d3.timer(animate);
  }
};

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
  d3.select("#dock-" + id + " .ring")
    .classed("hide", false)
    .attr("stroke", color)
    .transition()
    .ease("elastic")
    .duration(800)
    .attr("r", "20px")
    .each("end", function () {
      d3.select(this).classed("hide", true).attr("r", "5px");
    });
};

var drawTrip = function (trips) {
  var routes = svgBikeAnimations.append("svg:g")
    .selectAll("path")
    .data(trips.features)
    .enter().append("svg:g")
    .attr("class", "route")
    .append("svg:path")
    .attr("d", path)
    .attr("fill-opacity", 0);

  circles = svgBikeAnimations.selectAll(".route")
    .append("circle")
    .attr("r", 3)
    .attr("fill", '#f33')
    .classed("hide", true);

  renderZoom();
};

var animate = function (e) {
  if (!play) {
    timermemo = timer;
    return true;
  }
  renderFrame(e);
};

var renderFrame = function(e) {
  timer = (timermemo + e) % animduration;
  realtime = timer * day / animduration;
  realTimeFormatted = formatMilliseconds(realtime);
  timerdisplay.html(realTimeFormatted);

  // console.log("timer", realTimeFormatted, timer);
  handle.attr("transform", function (d) {
    return "translate(" + animscale(timer) + ")";
  });

  for (var i = 0; i < circles[0].length; i++) {
    d3.select(circles[0][i])
      .attr("transform", function (d) {
        var thePath = d3.select(this.parentNode).select("path").node();
        var startTime = timeToMilliSeconds(d.properties.startTime);
        var endTime = timeToMilliSeconds(d.properties.endTime);

        if (realtime - startTime > 0 && endTime - realtime > 0) {
          if (d3.select(circles[0][i]).classed("hide")) {
            d3.select(circles[0][i]).classed("hide", false);
            if (play) {
              makeRings(d.properties.startTerminal, "red");
            }
          }
          var p = thePath.getPointAtLength(thePath.getTotalLength() * (realtime - startTime) / (endTime - startTime));
          return "translate(" + [p.x, p.y] + ")";
        } else {
          if (!d3.select(circles[0][i]).classed("hide")) {
            d3.select(circles[0][i]).classed("hide", true);
            if (play) {
              makeRings(d.properties.endTerminal, "green");
            }
          }
        }
      });
  }
}

function renderZoom() {
  var tiles = tile.scale(zoom.scale()).translate(zoom.translate())();

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
          })).enter().append("path").attr("class", function (d) {
            return d.properties.kind;
          }).attr("d", tilePath);
      });
    });

  svgBikeAnimations.selectAll(".dock")
    .attr("cx", function (d) {
      return projection(d.coord)[0];
    }).attr("cy", function (d) {
      return projection(d.coord)[1];
    });
  
  svgBikeAnimations.selectAll(".route path")
    .attr("d", path);

  svgBikeAnimations.selectAll(".ring")
    .attr("cx", function (d) {
      return projection(d.coord)[0]
    }).attr("cy", function (d) {
      return projection(d.coord)[1]
    });

  svgBikeAnimations.selectAll(".route circle")
    .attr({
      "transform": function(d) {
        var thePath = d3.select(this.parentNode).select("path").node();
        var startTime = timeToMilliSeconds(d.properties.startTime);
        var endTime = timeToMilliSeconds(d.properties.endTime);

        if (realtime - startTime > 0 && endTime - realtime > 0) {
          var p = thePath.getPointAtLength(thePath.getTotalLength() * (realtime - startTime) / (endTime - startTime));
          return "translate(" + [p.x, p.y] + ")";
        } 
      }
    });
};

function mousemoved() {
  info.text(formatLocation(projection.invert(d3.mouse(this)), zoom.scale()));
}

function matrix3d(scale, translate) {
  var k = scale / 256,
    r = scale % 1 ? Number : Math.round;
  return "matrix3d(" + [k, 0, 0, 0, 0, k, 0, 0, 0, 0, k, 0, r(translate[0] * scale), r(translate[1] * scale), 0, 1] + ")";
}

function prefixMatch(p) {
  var i = -1,
    n = p.length,
    s = document.body.style;
  while (++i < n)
    if (p[i] + "Transform" in s) return "-" + p[i].toLowerCase() + "-";
  return "";
}

function formatLocation(p, k) {
  var format = d3.format("." + Math.floor(Math.log(k) / 2 - 2) + "f");
  return (p[1] < 0 ? format(-p[1]) + "°S" : format(p[1]) + "°N") + " " + (p[0] < 0 ? format(-p[0]) + "°W" : format(p[0]) + "°E");
}

d3.json("/api/timeline", function (error, json) {
  if (error) {
    console.log("error", error);
  }
  dbJson = parseDBJson(json);
  console.log("successsssss--------->", dbJson);
  drawTrip(dbJson);
});

button.on("click", function () {
  play = !play;
  if (play) {
    d3.timer(animate);
  }
});

d3.json("../json/docks.json", function (error, docks) {
  if (error) throw error;

  var c = d3.scale.linear()
    .domain([0, 27])
    .range([0, 1]);

  var docks = svgBikeAnimations.selectAll(".dock")
    .data(docks.features)
    .enter().append("g")
    .attr("id", function (d) {
      return "dock-" + d.dock
    });

  docks.append("circle")
    .attr("class", "dock")
    .attr("cx", function (d) {
      return projection(d.coord)[0];
    }).attr("cy", function (d) {
      return projection(d.coord)[1];
    }).attr("r", "5px").attr("fill", function (d) {
      return colorscale(c(d.amt))
    });

  docks.append("circle")
    .attr({
      "fill": "none",
      "stroke-width": "1px",
      "r": "5px",
    })
    .classed("ring hide", true)
    .attr("cx", function (d) {
      return projection(d.coord)[0]
    })
    .attr("cy", function (d) {
      return projection(d.coord)[1]
    });

  renderZoom();
});


