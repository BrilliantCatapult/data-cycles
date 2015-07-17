$(document).ready(function () {
  var json, map,
    path, vis, xy,
    duration, offset, origin_x, origin_y, len, group, circle;
  // Draw a GeoJSON line on the map:
  map = $('#map');
  xy = d3.geo.mercator().scale(480000).translate([630700, 401100]);
  path = d3.geo.path().projection(xy);
  vis = d3.select("#map").append("svg:svg").attr("width", 960).attr("height", 600);
  d3.json("../json/path.json", function (error, dots) {
    vis.append("svg:g").attr("class", "route").selectAll("path").data(json.features).enter().append("svg:path").attr("d", path).attr("fill-opacity", 0.5).attr("fill", "#fff").attr("stroke", "#333");
    // Draw a red circle on the map:
    group = vis.append("svg:g");
    var targetPath = d3.selectAll('.route')[0][0];
    var pathNode = d3.select(targetPath).selectAll('path').node();
    var pathLength = pathNode.getTotalLength();
    circle = group.append("circle").attr({
      r: 10,
      fill: '#f33',
      transform: function () {
        var p = pathNode.getPointAtLength(0)
        return "translate(" + [p.x, p.y] + ")";
      }
    });
    // Animate the circle:
    duration = 10000;
    circle.transition().duration(duration).ease("linear").attrTween("transform", function (d, i) {
      return function (t) {
        var p = pathNode.getPointAtLength(pathLength * t);
        return "translate(" + [p.x, p.y] + ")";
      }
    });
  });
});
